import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.FileVisitResult;
import java.nio.file.Files;
import java.nio.file.InvalidPathException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.SimpleFileVisitor;
import java.nio.file.StandardCopyOption;
import java.nio.file.attribute.BasicFileAttributes;
import java.util.Comparator;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;
import java.util.zip.ZipOutputStream;
import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;

public class utils {
    
    public static void main(String[] args) {

        String action = args.length > 0 ? args[0] : null;
        String zipFile = args.length > 1 ? args[1] : "";
        if (action == null || action.isBlank() || !(action.contains("-c") || action.contains("-u"))) {
            System.err.print("Please provide a valid command: first argument should be -c for compressing, -u for uncompress");
        }

        try {
            switch (action) {
                case "-u": doUnzip(zipFile); break;
                case "-c": doArchive(); break;
                default:
                    System.err.printf("Can't manage action : '%s'", action);
            }
        } catch (InvalidPathException e) {
            e.printStackTrace();
        } catch(IOException e) {
            e.printStackTrace();
        }

        System.exit(0);
    }
    
    private static void doUnzip(final String zipFile) throws IOException {
        if (zipFile == null || zipFile.isBlank()) {
            System.err.print("Second argument: please provide a Zip File path");
        }

        Path source = Paths.get(zipFile);
        Path target = Paths.get("source");

        if (!source.toFile().exists()) {
            System.err.printf("Zip File '%s' isn't a valid path", zipFile);
        }
        if (!source.toFile().canRead()) {
            System.err.printf("Zip File '%s' isn't readable", zipFile);
        }

        // create target at init
        if (!target.toFile().exists()) {
            target.toFile().mkdirs();
        }

        System.out.printf("Unzip main archive '%s'%n", source.toAbsolutePath());
        utils.unzipFolder(source, target);

        System.out.printf("Unzip all files into '%s'%n", target.toAbsolutePath().toString());

        Files.list(target)
            .filter(c -> c.toString().endsWith(".zip"))
            .forEach(c -> {
                try {
                    String filename = c.getFileName().toString();
                    filename = filename.substring(0, filename.lastIndexOf("."));
                    Path subtarget = Paths.get("source/" + filename);

                    System.out.printf("Unzip '%s' into '%s'%n", c.toAbsolutePath().toString(), subtarget.toAbsolutePath().toString());
                    unzipFolder(c.toAbsolutePath(), subtarget);
                    c.toFile().delete();
                } catch (IOException e) {
                    e.printStackTrace();    
                }
            });

        System.out.println("Unzip Done");
    }

    private static void doArchive() throws IOException {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("YYYYMMdd-HHmmdd").withZone(ZoneId.systemDefault());
        String targetZipFilename = "kapc_" + formatter.format(Instant.now()) + ".zip";
        Path source = Paths.get("source");
        Path targetDir = Paths.get("target");

        // delete targetDir
        if (targetDir.toFile().exists()) {
            Files.walk(targetDir)
                    .sorted(Comparator.reverseOrder())
                    .map(Path::toFile)
                    .forEach(File::delete);
            targetDir.toFile().delete();
        }

        // recreate targetDir
        if (!targetDir.toFile().exists()) {
            targetDir.toFile().mkdirs();
        }

        // zip all subdirectories
        Files.list(source)
            .filter(c -> c.toString().endsWith(".zip"))
            .forEach(c -> {
                try {
                    zipFolder(c.toAbsolutePath(), targetDir);
                } catch (IOException e) {
                    e.printStackTrace();
                }
                });
            

        // make one zip of all subdirectories
        compress(targetDir, targetZipFilename);
    }


    private static void unzipFolder(Path source, Path target) throws IOException {

        try (ZipInputStream zis = new ZipInputStream(new FileInputStream(source.toFile()))) {

            // list files in zip
            ZipEntry zipEntry = zis.getNextEntry();

            while (zipEntry != null) {

                boolean isDirectory = false;
                // example 1.1
                // some zip stored files and folders separately
                // e.g data/
                //     data/folder/
                //     data/folder/file.txt
                if (zipEntry.getName().endsWith(File.separator)) {
                    isDirectory = true;
                }

                Path newPath = zipSlipProtect(zipEntry, target);

                if (isDirectory) {
                    Files.createDirectories(newPath);
                } else {

                    // example 1.2
                    // some zip stored file path only, need create parent directories
                    // e.g data/folder/file.txt
                    if (newPath.getParent() != null) {
                        if (Files.notExists(newPath.getParent())) {
                            Files.createDirectories(newPath.getParent());
                        }
                    }

                    // copy files, nio
                    Files.copy(zis, newPath, StandardCopyOption.REPLACE_EXISTING);

                    // copy files, classic
                    /*try (FileOutputStream fos = new FileOutputStream(newPath.toFile())) {
                        byte[] buffer = new byte[1024];
                        int len;
                        while ((len = zis.read(buffer)) > 0) {
                            fos.write(buffer, 0, len);
                        }
                    }*/
                }

                zipEntry = zis.getNextEntry();

            }
            zis.closeEntry();

        }

    }

    // protect zip slip attack
    private static Path zipSlipProtect(ZipEntry zipEntry, Path targetDir)
            throws IOException {

        // test zip slip vulnerability
        // Path targetDirResolved = targetDir.resolve("../../" + zipEntry.getName());

        Path targetDirResolved = targetDir.resolve(zipEntry.getName());

        // make sure normalized file still has targetDir as its prefix
        // else throws exception
        Path normalizePath = targetDirResolved.normalize();
        if (!normalizePath.startsWith(targetDir)) {
            throw new IOException("Bad zip entry: " + zipEntry.getName());
        }

        return normalizePath;
    }
    
    // zip a directory, including sub files and sub directories
    private static void zipFolder(Path source, Path target) throws IOException {

        // get folder name as zip file name
        String zipFileName = target.toAbsolutePath() + File.separator + source.getFileName().toString() + ".zip";

        try (ZipOutputStream zos = new ZipOutputStream(new FileOutputStream(zipFileName))) {

            Files.walkFileTree(source, new SimpleFileVisitor<>() {
                @Override
                public FileVisitResult visitFile(Path file, BasicFileAttributes attributes) {

                    // only copy files, no symbolic links
                    if (attributes.isSymbolicLink()) {
                        return FileVisitResult.CONTINUE;
                    }

                    try (FileInputStream fis = new FileInputStream(file.toFile())) {

                        Path targetFile = source.relativize(file);
                        zos.putNextEntry(new ZipEntry(targetFile.toString()));

                        byte[] buffer = new byte[1024];
                        int len;
                        while ((len = fis.read(buffer)) > 0) {
                            zos.write(buffer, 0, len);
                        }

                        // if large file, throws out of memory
                        // byte[] bytes = Files.readAllBytes(file);
                        // zos.write(bytes, 0, bytes.length);

                        zos.closeEntry();

                        System.out.printf("Zip file : %s into %s%n", file, zipFileName);

                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                    return FileVisitResult.CONTINUE;
                }

                @Override
                public FileVisitResult visitFileFailed(Path file, IOException exc) {
                    System.err.printf("Unable to zip : %s%n%s%n", file, exc);
                    return FileVisitResult.CONTINUE;
                }
            });

        }
    }

    // zip all files into one
    private static void compress(Path sourceDir, String zipFileName) {
        String zipFilePath = sourceDir.toFile().getAbsoluteFile() + File.separator + zipFileName;
        System.out.printf("Creating Archive '%s'%n", zipFilePath);
        try {
            final ZipOutputStream outputStream = new ZipOutputStream(new FileOutputStream(zipFilePath));
            Files.walkFileTree(sourceDir, new SimpleFileVisitor<Path>() {
                @Override

                public FileVisitResult visitFile(Path file, BasicFileAttributes attributes) {

                    try {
                        Path targetFile = sourceDir.relativize(file);
                        if (targetFile.toString().endsWith(".zip.zip")) {
                            outputStream.putNextEntry(new ZipEntry(targetFile.toString()));
                            byte[] bytes = Files.readAllBytes(file);
                            outputStream.write(bytes, 0, bytes.length);
                            outputStream.closeEntry();
                            targetFile.toFile().delete();
                            System.out.printf("Added '%s' into '%s'%n", targetFile.toAbsolutePath(), zipFilePath);
                        } else if (!targetFile.toString().equals(zipFileName)) {
                            System.out.printf("Maybe a warning: the directory '%s' contains other files than compressed directories %n", targetFile.toAbsolutePath());
                        }
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                    return FileVisitResult.CONTINUE;
                }
            });
            outputStream.close();
            System.out.printf("Archive '%s' Done !%n", zipFilePath);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

}
