

g_variables['var-report-model']  =  "";
g_variables['var-report-model'] +=  "karuta.report-parts,model-table,Table@en/Table@fr,reporter";
g_variables['var-report-model'] += ";karuta.report-parts,model-sort-table,Sortable Table@en/Table triable@fr,reporter";
g_variables['var-report-model'] += ";#line;karuta.report-parts,model-qrcode,QR Code@en/Code QR@fr,reporter";
g_variables['var-report-model'] += ";karuta.report-parts,model-europass,Europass@en/Europass@fr,reporter";
g_variables['var-report-model'] += ";karuta.report-parts,refresh-button,Refresh Dashboard@en/Rafraîchir tableau de bord@fr,reporter";
g_variables['var-report-model'] += ";#line;##var-report-loops##;#line;karuta.report-parts,model-svg,SVG@en/SVG@fr,reporter";
g_variables['var-report-model'] += ";#line;##var-report-csv##";

// composantes construction de tableau
g_variables['var-report-table']  = "";
g_variables['var-report-table'] +=  "karuta.report-parts,model-thead,Table Head@en/En-tête de tableau@fr,reporter";
g_variables['var-report-table'] += ";karuta.report-parts,model-tbody,Table Body@en/Corps de tableau@fr,reporter";
g_variables['var-report-table'] += ";karuta.report-parts,model-row,Row@en/Rangée@fr,reporter";
g_variables['var-report-table'] += ";#line;##var-report-loops##";
g_variables['var-report-table'] += ";#line;##var-report-instructions##";
g_variables['var-report-table'] += ";#line;##var-report-operations##";

g_variables['var-report-thead']  = "";
g_variables['var-report-thead'] +=  "karuta.report-parts,model-rw-thead,Head Row@en/Rangée d'en-tête@fr,reporter";
g_variables['var-report-thead'] += ";#line;##var-report-loops##";
g_variables['var-report-thead'] += ";#line;##var-report-instructions##";
g_variables['var-report-thead'] += ";#line;##var-report-operations##";

g_variables['var-report-thead-row']  = "";
g_variables['var-report-thead-row'] +=  "karuta.report-parts,model-th,Head Cell@en/Cellule d'en-tête@fr,reporter";
g_variables['var-report-thead-row'] += ";#line;##var-report-loops##";
g_variables['var-report-thead-row'] += ";#line;##var-report-instructions##";
g_variables['var-report-thead-row'] += ";#line;##var-report-operations##";

g_variables['var-report-th']  = "";
g_variables['var-report-th'] +=  "#line;##var-report-display##";
g_variables['var-report-th'] += ";#line;##var-report-loops##";
g_variables['var-report-th'] += ";#line;##var-report-instructions##";
g_variables['var-report-th'] += ";#line;##var-report-operations##";

g_variables['var-report-tbody']  = "";
g_variables['var-report-tbody'] +=  "karuta.report-parts,model-row,Row@en/Rangée@fr,reporter";
g_variables['var-report-tbody'] += ";#line;##var-report-loops##;#line;##var-report-instructions##;#line;##var-report-operations##";

g_variables['var-report-row']  = "";
g_variables['var-report-row'] +=  "karuta.report-parts,model-cell,Cell@en/Cellule@fr,reporter";
g_variables['var-report-row'] += ";#line;##var-report-loops##;#line;##var-report-instructions##;#line;##var-report-operations##";

g_variables['var-report-cell']  = "";
g_variables['var-report-cell'] +=  "karuta.report-parts,model-table,Table@en/Table@fr,reporter";
g_variables['var-report-cell'] += ";#line;##var-report-display##";
g_variables['var-report-cell'] += ";#line;##var-report-loops##";
g_variables['var-report-cell'] += ";#line;##var-report-instructions##";
g_variables['var-report-cell'] += ";#line;##var-report-operations##";


// composantes d'affichage
g_variables['var-report-display']  = "";
g_variables['var-report-display'] +=  "karuta.report-parts,node_resource,Node@en/Nœud@fr,reporter";
g_variables['var-report-display'] += ";karuta.report-parts,text,Text@en/Texte@fr,reporter";
g_variables['var-report-display'] += ";karuta.report-parts,url2unit,URL2Unit@en/URL2Unit@fr,reporter";
g_variables['var-report-display'] += ";karuta.report-parts,url2portfolio,URL2Portfolio@en/URL2Portfolio@fr,reporter";
g_variables['var-report-display'] += ";karuta.report-parts,preview2unit,Preview2Unit@en/Aperçu2Unit@fr,reporter";
g_variables['var-report-display'] += ";karuta.report-parts,model-qrcode,QR Code@en/Code QR@fr,reporter";
g_variables['var-report-display'] += ";karuta.report-parts,model-europass,Europass@en/Europass@fr,reporter";
g_variables['var-report-display'] += ";karuta.report-parts,username,User Login@en/Login utilisateur@fr,reporter";
g_variables['var-report-display'] += ";karuta.report-parts,firstname,User First Name@en/Prénom utilisateur@fr,reporter";
g_variables['var-report-display'] += ";karuta.report-parts,lastname,User Last Name@en/Nom famille utilisateur@fr,reporter";
g_variables['var-report-display'] += ";karuta.report-parts,first-last-name,User First and Last Names@en/Prénom et nom famille@fr,reporter";
g_variables['var-report-display'] += ";karuta.report-parts,show-sharing,Show Sharing@en/Afficher les partages@fr,reporter";
g_variables['var-report-display'] += ";karuta.report-parts,menu,Menu@en/Menu@fr,reporter";
g_variables['var-report-display'] += ";karuta.report-parts,refresh-button,Refresh Dashboard@en/Rafraîchir tableau de bord@fr,reporter";
g_variables['var-report-display'] += ";karuta.report-parts,collapsable-section,Collapsible Section@en/Section repliable@fr,reporter";


// boucles
g_variables['var-report-loops']  = "";
g_variables['var-report-loops'] +=  "karuta.report-parts,for-each-node,For Each Node@en/Pour chaque nœud@fr,reporter";
g_variables['var-report-loops'] += ";karuta.report-parts,for-each-node-js,For Each Node - js@en/Pour chaque nœud - js@fr,reporter";
g_variables['var-report-loops'] += ";karuta.report-parts,for-each-portfolio,For Each Portfolio@en/Pour chaque portfolio@fr,reporter";
g_variables['var-report-loops'] += ";karuta.report-parts,for-each-portfolio-js,For Each Portfolio - JS@en/Pour chaque portfolio - JS@fr,reporter";
g_variables['var-report-loops'] += ";karuta.report-parts,for-each-portfolios-nodes,For Each Portfolio Node@en/Pour chaque nœud de portfolio@fr,reporter";
g_variables['var-report-loops'] += ";karuta.report-parts,for-each-line,For Each Line@en/Pour chaque ligne@fr,reporter";
g_variables['var-report-loops'] += ";karuta.report-parts,for-each-vector,For Each Vector@en/Pour chaque vecteur@fr,reporter";
g_variables['var-report-loops'] += ";karuta.report-parts,loop,Loop@en/Boucle@fr,reporter";

// instructions
g_variables['var-report-instructions']  = "";
g_variables['var-report-instructions'] +=  "karuta.report-parts,go-parent,Go Parent@en/Monter au parent@fr,reporter";
g_variables['var-report-instructions'] += ";karuta.report-parts,if-then-else,If Then Else@en/Si Alors Sinon@fr,reporter";

//operations
g_variables['var-report-operations']  = "";
g_variables['var-report-operations'] +=  "karuta.report-parts,report-variable,Variable@en/Variable@fr,reporter";
g_variables['var-report-operations'] += ";karuta.report-parts,aggregate,Aggregate@en/Agrégat@fr,reporter";
g_variables['var-report-operations'] += ";karuta.report-parts,operation,Operation@en/Opération@fr,reporter";

//CSV
g_variables['var-report-csv']  = "";
g_variables['var-report-csv'] +=  "karuta.report-parts,csv-line,CSV Line@en/Ligne CSV@fr,reporter";
g_variables['var-report-csv'] += ";karuta.report-parts,csv-value,CSV Value@en/Valeur CSV@fr,reporter";