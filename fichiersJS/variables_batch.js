
// composantes instructions
g_variables['var-batch-instructions']  =  "";
g_variables['var-batch-instructions'] +=  "karuta.batch-parts,for-each-line,For Each Line@en/Pour chaque ligne@fr,batcher";
g_variables['var-batch-instructions'] +=  ";karuta.batch-parts,for-each-tree,For Each Tree@en/Pour chaque arbre@fr,batcher";
g_variables['var-batch-instructions'] +=  ";karuta.batch-parts,for-each-person,For Each User@en/Pour chaque utilisateur@fr,batcher";
g_variables['var-batch-instructions'] +=  ";karuta.batch-parts,for-each-node,For Each Node@en/Pour chaque noeud@fr,batcher";
g_variables['var-batch-instructions'] +=  ";karuta.batch-parts,if-then-else,If Then Else@en/Si Alors Sinon@fr,batcher";
g_variables['var-batch-instructions'] +=  ";karuta.batch-parts,batch-variable,Variable@en/Variable@fr,batcher";

// composantes arbre
g_variables['var-batch-tree']  =  "";
g_variables['var-batch-tree'] +=  "karuta.karuta-structured-resources,create-project,Create Folder@en/Créer dossier@fr,batcher";
g_variables['var-batch-tree'] +=  ";karuta.batch-parts,create-tree,Create Tree@en/Créer arbre@fr,batcher";
g_variables['var-batch-tree'] +=  ";karuta.batch-parts,select-tree,Select Tree@en/Sélectionner arbre@fr,batcher";
g_variables['var-batch-tree'] +=  ";karuta.batch-parts,share-tree,Share Tree@en/Partager arbre@fr,batcher";
g_variables['var-batch-tree'] +=  ";karuta.batch-parts,unshare-tree,Unshare Tree@en/Départager arbre@fr,batcher";
g_variables['var-batch-tree'] +=  ";karuta.batch-parts,delete-tree,Delete Tree@en/Supprimer arbre@fr,batcher";
g_variables['var-batch-tree'] +=  ";karuta.batch-parts,re-instantiate-tree,Reinstantiate Tree@en/Ré-instancier arbre@fr,batcher";
g_variables['var-batch-tree'] +=  ";karuta.batch-parts,update-tree-root,Update Tree Root@en/Mise à jour racine arbre@fr,batcher";
g_variables['var-batch-tree'] +=  ";karuta.batch-parts,set-owner,Set Owner@en/Mise à jour propriétaire@fr,batcher";

// composantes user
g_variables['var-batch-user']  = "";
g_variables['var-batch-user'] +=  "karuta.batch-parts,create-person,Create User@en/Créer utilisateur@fr,batcher";
g_variables['var-batch-user'] +=  ";karuta.batch-parts,update-person,Update User@en/Mettre à jour utilisateur@fr,batcher";
g_variables['var-batch-user'] +=  ";karuta.batch-parts,inactivate-person,Deactivate User@en/Désactiver utilisateur@fr,batcher";
g_variables['var-batch-user'] +=  ";karuta.batch-parts,activate-person,Activate User@en/Activer utilisateur@fr,batcher";
g_variables['var-batch-user'] +=  ";karuta.batch-parts,delete-person,Delete User@en/Supprimer utilisateur@fr,batcher";

// composantes user group
g_variables['var-batch-usergroup']  = "";
g_variables['var-batch-usergroup'] +=  "karuta.batch-parts,create-usergroup,Create User Group@en/Créer groupe utilisateurs@fr,batcher";
g_variables['var-batch-usergroup'] +=  ";karuta.batch-parts,join-usergroup,Join User Group@en/Joindre groupe utilisateurs@fr,batcher";
g_variables['var-batch-usergroup'] +=  ";karuta.batch-parts,leave-usergroup,Leave User Group@en/Quitter groupe utilisateurs@fr,batcher";
g_variables['var-batch-usergroup'] +=  ";karuta.batch-parts,share-usergroup,Share User Group With Portfolio@en/Partager groupe utilisateurs avec portfolio@fr,batcher";
g_variables['var-batch-usergroup'] +=  ";karuta.batch-parts,unshare-usergroup,Unshare User Group From Portfolio@en/Départager groupe utilisateurs de portfolio@fr,batcher";
g_variables['var-batch-usergroup'] +=  ";karuta.batch-parts,share-groups,Share Group Users With Group Pourtfolios@en/Partager utilisateurs groupe avec portfolios groupe@fr,batcher";

// composantes portfolio group
g_variables['var-batch-portfoliogroup']  = "";
g_variables['var-batch-portfoliogroup'] +=  "karuta.batch-parts,create-portfoliogroup,Create Portfolio Group@en/Créer groupe portfolios@fr,batcher";
g_variables['var-batch-portfoliogroup'] +=  ";karuta.batch-parts,join-portfoliogroup,Join Portfolio Group@en/Joindre groupe portfolios@fr,batcher";
g_variables['var-batch-portfoliogroup'] +=  ";karuta.batch-parts,leave-portfoliogroup,Leave Portfolio Group@en/Quitter groupe portfolios@fr,batcher";
g_variables['var-batch-portfoliogroup'] +=  ";karuta.batch-parts,share-portfoliogroup,Share User With Portfolio Group@en/Partager utilisateur avec groupe portfolios@fr,batcher";
g_variables['var-batch-portfoliogroup'] +=  ";karuta.batch-parts,unshare-portfoliogroup,Unshare User From Portfolio Group@en/Départager utilisateur de groupe portfolios@fr,batcher";

// composantes noeud
g_variables['var-batch-node']  = "";
g_variables['var-batch-node'] +=  "karuta.batch-parts,import-node,Import Node@en/Importer nœud@fr,batcher";
g_variables['var-batch-node'] +=  ";karuta.batch-parts,moveup-node,Move Up@en/Monter nœud@fr,batcher";
g_variables['var-batch-node'] +=  ";karuta.batch-parts,move-node,Move Node@en/Déplacer nœud@fr,batcher";
g_variables['var-batch-node'] +=  ";karuta.batch-parts,update-node-resource,Update Node Resource@en/Mise à jour ressource du nœud@fr,batcher";
g_variables['var-batch-node'] +=  ";karuta.batch-parts,delete-node,Delete Node@en/Supprimer nœud@fr,batcher";
g_variables['var-batch-node'] +=  ";karuta.batch-parts,submitall,Submit for All@en/Soumettre pour tous@fr,batcher";

// compsantes metadata
g_variables['var-batch-metadata']  = "";
g_variables['var-batch-metadata'] +=  "karuta.batch-parts,update-metadata,Update Metadata (Node)@en/Mise à jour métadonnées (noeud)@fr,batcher";
g_variables['var-batch-metadata'] +=  ";karuta.batch-parts,update-metadata-wad,Update WAD Metadata (Model Rights)@en/Mise à jour métadonnées WAD (droits modèles)@fr,batcher";
g_variables['var-batch-metadata'] +=  ";karuta.batch-parts,update-metadata-epm,Update EPM Metadata (CSS)@en/Mise à jour métadonnées EPM (CSS)@fr,batcher";
g_variables['var-batch-metadata'] +=  ";karuta.batch-parts,update-rights,Update Rights (Instance Rights)@en/Mise à jour droits (droits instances)@fr,batcher";

// composantes refresh
g_variables['var-batch-refresh']  = "";
g_variables['var-batch-refresh'] +=  "karuta.batch-parts,refresh-tree-url2unit,Refresh URL2Units@en/Actualiser les URL2Units@fr,batcher";
g_variables['var-batch-refresh'] +=  ";karuta.batch-parts,refresh-tree-url2portfolio,Refresh URL2Portfolios@en/Actualiser les URL2Portfolios@fr,batcher";

// composante byID
g_variables['var-batch-byid']  = "";
g_variables['var-batch-byid'] +=  "karuta.batch-parts,delete-tree-byid,Delete Tree by Id@en/Supprimer un arbre par Id@fr,batcher";
g_variables['var-batch-byid'] +=  ";karuta.batch-parts,update-field-byid,Modify Node by Id@en/Modifier un noeud par Id@fr,batcher";
g_variables['var-batch-byid'] +=  ";karuta.batch-parts,delete-node-byid,Delete Node by Id@en/Supprimer un noeud par Id@fr,batcher";
g_variables['var-batch-byid'] +=  ";karuta.batch-parts,reset-document-byid,Reset Document by Id@en/Réinitialiser un document par Id@fr,batcher";


// toutes les composantes sauf les instructions
g_variables['var-batch-all']  = "";
g_variables['var-batch-all'] +=  "##var-batch-user##;#line;##var-batch-tree##;#line;##var-batch-usergroup##";
g_variables['var-batch-all'] +=  ";#line;##var-batch-portfoliogroup##;#line;##var-batch-node##;#line;##var-batch-metadata##";
g_variables['var-batch-all'] +=  ";#line;karuta.batch-parts,update-resource,Update Resources@en/Mise à jour ressources@fr,batcher";
g_variables['var-batch-all'] +=  ";#line;karuta.batch-parts,uuid-components,UUID Components@en/Composantes UUID@fr,batcher";
g_variables['var-batch-all'] +=  ";#line;##var-batch-refresh##;#line;##var-batch-byid##";
g_variables['var-batch-all'] +=  ";#line;karuta.batch-parts,batch-variable,Variable@en/Variable@fr,batcher";

