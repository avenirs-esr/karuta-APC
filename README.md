# KAPC Sources with tools

## Description

This repository contains sources of KAPC. Here will be available only uncompressed files obtained with a java tool that permit to unconmpress and compress files related to karuta needs.

## Tool commands

### **init for use**

1. cloning
   * for users `git clone https://github.com/EsupPortail/KAPC.git`
   * for kapc developpers `git clone git@github.com:EsupPortail/KAPC.git`
2. cd KAPC

### **build locally the tool**

1. check that you have at least java 11 available: `java --version`
2. from a console (from the project directory) run `javac utils.java` to compile
3. check that a `utils.class` is created without error

You should run all commands from this project directory !

### **import/update KAPC sources**

1. export from karuta the archive locally
2. use this command to uncompress on this project: `java utils -u THE_PATH_TO_ZIP_FILE`
3. check that the `./source/` directory is updated, you can use the git command `git diff`
4. `git add -a source/` to add to index files to commit
5. `git commit` to create a feature/path commit - [see here to follow coventional commit format/text](https://www.conventionalcommits.org/)
6. `git push` to share sources by pushing on central repository.

### **generate KAPC zip file**

1. use this command to compress KAPC source `java utils -c`
2. read the output to know where the zip is generated (into `target` folder).
