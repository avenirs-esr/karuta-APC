// === version 1.3.5 2022/02/15 ===
// 1.3.5 test si submitall dans soumettreAutres()
// 1.3.4 fermeture balises xml <br> et <img> dans feedback
// 1.3.3 évaluation compétence
// 1.3.2 test demande compétence
// 1.3.1 test si demande à un pair ou pro
// 1.3.0 nouvelle gestion des vecteurs
// 1.2.1.affichage date


//# sourceURL=kapc1.3.js
//=============== TESTS ==================

function testSiEvalDemandee(nodeid)
{
	const datedemandeid = $("*:has(>metadata[semantictag*=demande-eval])",$(UICom.structure.ui[nodeid].node)).attr("id");
	const date = UICom.structure.ui[datedemandeid].resource.getAttributes()['text'];
	if (date!="")
		return false;
	else
		return true;
}

function testSiEvalEnseignantDemandee(nodeid)
{
	const pageid = $("#page").attr('uuid');
	const datedemandeid = $("*:has(>metadata[semantictag*=date-dem-eval])",$(UICom.structure.ui[pageid].node)).attr("id");
	const date = UICom.structure.ui[datedemandeid].resource.getAttributes()['text'];
	if (date!="")
		return false;
	else
		return true;
}

function testSiAfficherDemande(nodeid)
{
	return testSiEvalDemandee(nodeid) && testSiEvalEnseignantDemandee(nodeid);
}

function testSiAfficherDemandeEvaluation()
{
	const pageid = $("#page").attr('uuid');
	const deadlineid = $("*:has(>metadata[semantictag*=deadline])",$(UICom.structure.ui[pageid].node)).attr("id");
	const today = new Date().getTime();
	const utc = UICom.structure.ui[deadlineid].resource.getAttributes()['utc'];
	if (utc<today || USER.admin || g_userroles[0]=='designer' ) {
		return true;
	} else {
		return false;
	}
}


function testPrevGGRCodeNotEmpty(node) {
	// le GGR précédent doit avoir la métadonnée Recharger la page cochée
	return($("code",$("asmResource[xsi_type='Get_Get_Resource']",$(node.node).prev())).html()!="");
}

function testEnseignantCodeNotEmpty(uuid) {
	if (uuid == null)
		uuid = $("#page").attr('uuid');
	const enseignants = $("asmContext:has(metadata[semantictag='enseignant-select'])",UICom.structure.ui[uuid].node);
	return (enseignants.length>0);
}

function niveauchoisi(node) {
	// retourne vrai si le Get_Get_Resource précédent le noeud n'est pas vide, faux sinon
	return($("code",$("asmResource[xsi_type='Get_Get_Resource']",$(node.node).prev())).html()!="");
}

function envoiErreurSiPasEnseignants() {
	var uuid = $("#page").attr('uuid');
	const enseignants = $("asmContext:has(metadata[semantictag='enseignant-select'])",UICom.structure.ui[uuid].node);
	if (enseignants.length==0) {
		alert("Il n'y a pas d'enseignant ou d'évaluateur associé.");
		$("#edit-window").modal('hide');
		throw "Il n'y a pas d'enseignant associé.";
	}
}

function testNodeNotSubmitted(semtag,uuid) {
	if (uuid == null)
		uuid = $("#page").attr('uuid');
	const nodeid = $("*:has(>metadata[semantictag='"+semtag+"'])",UICom.structure.ui[uuid].node).attr("id");
	if (nodeid!=undefined)
		return testNotSubmitted(nodeid);
	else
		return true;
}

//====================================================

function setVariable_code (node)
{
	let variable = $("code",$("asmResource[xsi_type='nodeRes']",$(node))).text();
	let code = $("code",$("asmResource[xsi_type='Get_Resource']",$(node))).text();
	g_variables[variable+"_code"] = code;
}

//======================================================================================
//============= Mise à jour SAE/STAGE/ACTION/Compétence=================================
//======================================================================================

function setInformation(nodeid) {
	setPrenomNom(nodeid);
	setMatricule(nodeid);
	setCourriel(nodeid);
	setPageUUID(nodeid);
	setPortfolioUUID(nodeid);
}

function setPrenomNom(nodeid) {
	var prenom_nom =  $("*:has(>metadata[semantictag*='prenom_nom'])",UICom.structure.ui[nodeid].node)[0];
	var prenom_nomid = $(prenom_nom).attr("id");
	if (prenom_nom==undefined) {
		const srcecode = replaceVariable("##dossier-etudiants-modeles##.composantes-competences")
		prenom_nomid = importBranch(nodeid,srcecode,"prenom_nom");
		UIFactory.Node.upNode(prenom_nomid,false);
		UIFactory.Node.upNode(prenom_nomid,false);
		UIFactory.Node.reloadUnit(nodeid,false);
	}
	const prenom = $("*:has(>metadata[semantictag*='prenom-etudiant'])",g_portfolio_current)[0];
	const prenomid = $(prenom).attr("id");
	const nom = $("*:has(>metadata[semantictag*='nom-famille-etudiant'])",g_portfolio_current)[0];
	const nomid = $(nom).attr("id");
	$(UICom.structure.ui[prenom_nomid].resource.text_node[LANGCODE]).text(UICom.structure.ui[nomid].resource.getView()+" "+UICom.structure.ui[prenomid].resource.getView());
	UICom.structure.ui[prenom_nomid].resource.save();
}

function setMatricule(nodeid) {
	var etudiant_matricule =  $("*:has(>metadata[semantictag*='etudiant-matricule'])",UICom.structure.ui[nodeid].node)[0];
	var etudiant_matriculeid = $(etudiant_matricule).attr("id");
	if (etudiant_matricule==undefined) {
		const srcecode = replaceVariable("##dossier-etudiants-modeles##.composantes-competences")
		etudiant_matriculeid = importBranch(nodeid,srcecode,"etudiant-matricule");
		UIFactory.Node.reloadUnit(nodeid,false);
	}
	const matricule = $("*:has(>metadata[semantictag*='matricule-etudiant'])",g_portfolio_current)[0];
	const matriculeid = $(matricule).attr("id");
	$(UICom.structure.ui[etudiant_matriculeid].resource.text_node[LANGCODE]).text(UICom.structure.ui[matriculeid].resource.getView());
	UICom.structure.ui[etudiant_matriculeid].resource.save();
}

function setCourriel(nodeid) {
	var etudiant_courriel =  $("*:has(>metadata[semantictag*='etudiant-courriel'])",UICom.structure.ui[nodeid].node)[0];
	var etudiant_courrielid = $(etudiant_courriel).attr("id");
	if (etudiant_courriel==undefined) {
		const srcecode = replaceVariable("##dossier-etudiants-modeles##.composantes-competences")
		etudiant_courrielid = importBranch(nodeid,srcecode,"etudiant-courriel");
		UIFactory.Node.reloadUnit(nodeid,false);
	}
	const courriel = $("*:has(>metadata[semantictag*='courriel-etudiant'])",g_portfolio_current)[0];
	const courrielid = $(courriel).attr("id");
	$(UICom.structure.ui[etudiant_courrielid].resource.text_node[LANGCODE]).text(UICom.structure.ui[courrielid].resource.getView());
	UICom.structure.ui[etudiant_courrielid].resource.save();
}

function setPageUUID(nodeid) {
	var pageUUID = $($("*:has(>metadata[semantictag*='page-uuid'])",UICom.structure.ui[nodeid].node)[0]).attr("id");
	if (pageUUID==undefined) {
		const srcecode = replaceVariable("##dossier-etudiants-modeles##.composantes-competences")
		pageUUID = importBranch(nodeid,srcecode,"page-uuid");
		UIFactory.Node.reloadUnit(nodeid,false);
	}
	$(UICom.structure.ui[pageUUID].resource.text_node[LANGCODE]).text(nodeid);
	UICom.structure.ui[pageUUID].resource.save();
}

function setPortfolioUUID(nodeid) {
	var portfolioUUID = $($("*:has(>metadata[semantictag*='portfolio-uuid'])",UICom.structure.ui[nodeid].node)[0]).attr("id");
	if (portfolioUUID==undefined) {
		const srcecode = replaceVariable("##dossier-etudiants-modeles##.composantes-competences")
		portfolioUUID = importBranch(nodeid,srcecode,"portfolio-uuid");
		UIFactory.Node.reloadUnit(nodeid,false);
	}
	$(UICom.structure.ui[portfolioUUID].resource.text_node[LANGCODE]).text(g_portfolioid);
	UICom.structure.ui[portfolioUUID].resource.save();
}

//======================================================================================
//============== Traces du portfolio====================================================
//======================================================================================

function setNodeCodewDate(nodeid) {
	const code = new Date().getTime()+"@";
	$(UICom.structure.ui[nodeid].code_node).text(code);
	UICom.structure.ui[nodeid].save();
}
var kapc_to_be_deleted = [];

function verifier_presence_traces() {
	kapc_to_be_deleted = [];
	const traces = $("*:has(>metadata[semantictag*='trace-etudiant'])",g_portfolio_current);
	const select_traces = $("*:has(>metadata[semantictag*='select-trace'])",g_portfolio_current);
	for (let i=0;i<traces.length;i++){
		const traceid = $(traces[i]).attr('id');
		const code = UICom.structure.ui[traceid].getCode();
		const label = UICom.structure.ui[traceid].getLabel(null,'none');
		let present = false;
		for (let j=0;j<select_traces.length;j++){
			const select_traceid = $(select_traces[j]).attr('id');
			const select_trace_code = UICom.structure.ui[select_traceid].resource.getCode();
			if (select_trace_code==code) {
				present = true;
				break;
			}
			if (!present)
				kapc_to_be_deleted.push({'id':traceid,'label':label});
		}
	}
	if (kapc_to_be_deleted.length>0)
		confirm_delete_trace()
}
	
function confirm_delete_trace() {
	if (kapc_to_be_deleted.length>0) {
		const traceid = kapc_to_be_deleted[0].id;
		const label = kapc_to_be_deleted[0].label;
		kapc_to_be_deleted = kapc_to_be_deleted.slice(1); // on retire le premier
		document.getElementById('message-window-header').innerHTML = "ATTENTION";
		document.getElementById('message-window-body').innerHTML = "La trace <b>"+label+"</b> n'est pas utilisée dans le portfolio.<br/>Voulez-vous la supprimer ? <br/>ATTENTION cette action est irréversible.";
		var buttons = "<button class='btn' onclick=\"confirm_delete_trace();\">" + karutaStr[LANG]["Cancel"] + "</button>";
		buttons += "<button class='btn btn-danger' onclick=\"UIFactory.Node.remove('"+traceid+"',UIFactory.Node.reloadUnit);confirm_delete_trace()\">" + karutaStr[LANG]["button-delete"] + "</button>";
		document.getElementById('message-window-footer').innerHTML = buttons;
		$('#message-window').show();
	} else {
		document.getElementById('message-window-header').innerHTML = "";
		$('#message-window').hide();
	}
}

function verifier_supprimer_traces(nodeid) {
	let to_be_deleted = true;
	const code = UICom.structure.ui[nodeid].getCode();
	const select_traces = $("*:has(>metadata[semantictag*='select-trace'])",g_portfolio_current);
	for (let j=0;j<select_traces.length;j++){
		const select_traceid = $(select_traces[j]).attr('id');
		const select_trace_code = UICom.structure.ui[select_traceid].resource.getCode();
		if (select_trace_code==code) {
			to_be_deleted = confirm("ATTENTION - Cette trace est utilisée dans le portfolio. Voulez-vous vraiment la supprimer?");
			break;
		}
	}
	return to_be_deleted;
}

function verifier_supprimer_collections(nodeid) {
	let to_be_deleted = true;
	const collection_traces = $("*:has(>metadata[semantictag*='trace-etudiant'])",UICom.structure.ui[nodeid].node);
	for (let i=0;i<collection_traces.length;i++){
		const collection_traceid = $(collection_traces[i]).attr('id');
		const collection_trace_code = UICom.structure.ui[collection_traceid].getCode();
		const select_traces = $("*:has(>metadata[semantictag*='select-trace'])",g_portfolio_current);
		for (let j=0;j<select_traces.length;j++){
			const select_traceid = $(select_traces[j]).attr('id');
			const select_trace_code = UICom.structure.ui[select_traceid].resource.getCode();
			if (select_trace_code==collection_trace_code) {
				to_be_deleted = confirm("ATTENTION - Une trace de la collection est utilisée dans le portfolio. Voulez-vous vraiment supprimer la collection?");
				break;
			}
		}
	}
	return to_be_deleted;
}


//======================================================================================
//========================== DIVERS ====================================================
//======================================================================================

function ajouterPartage(nodeid) {
	var node = UICom.structure.ui[nodeid].node
	var metadatawad = $("metadata-wad",node)[0];
	var text = "etudiant,pair,?,2,336,Demander une évaluation à un pair@fr;etudiant,tuteur,?,3,336,Demander une évaluation à un tuteur@fr";
	$(metadatawad).attr("shareroles",text);
	var xml = xml2string(metadatawad);
	$.ajax({
		async : false,
		type : "PUT",
		contentType: "application/xml",
		dataType : "text",
		data : xml,
		nodeid : nodeid,
		url : serverBCK_API+"/nodes/node/" + nodeid+"/metadatawad",
		success : function(data) {
		},
		error : function(data) {
			console.log("ERROR update metadatawad("+this.nodeid+") -  attribute="+attribute+" value="+text);
		}
	});
}


//mise à jour du code et du libellé dela compétence dans la section 'mes compétences'
function setCompetenceCodeLabel(nodeid){
	let js = replaceVariable("setNodeCodeLabel(##currentnode##,##lastimported##)",UICom.structure.ui[nodeid]);
	eval(js);
}

function demandeEnregistree(nodeid){
	alert('Demande enregistrée')
}

function removeBackdropAndRelaod()
{
	$("#temp-window").remove();
	$('#confirmbackdrop').remove();
	fill_main_page();
}

//======================================================================================
//========================== Mises à jour dates ========================================
//======================================================================================

function majEvaluation(nodeid,sharetoemail) {
	var demande = $("*:has(>metadata[semantictag*='demande-eval'])",UICom.structure.ui[nodeid].node)[0];
	var demandeid = $(demande).attr("id");
	var text = " " + new Date().toLocaleString() + " à " + sharetoemail;
	UICom.structure.ui[demandeid].resource.text_node[LANGCODE].text(text);
	UICom.structure.ui[demandeid].resource.save();
}


function majDemEvalSAE(nodeid) {
	var demande = $("*:has(>metadata[semantictag*='date-dem-eval'])",$(UICom.structure.ui[nodeid].node))[0];
	var demandeid = $(demande).attr("id");
	const today = new Date();
	UICom.structure.ui[demandeid].value_node.text(today.getTime());
	UICom.structure.ui[demandeid].resource.text_node[LANGCODE].text(today.toLocaleString());
	UICom.structure.ui[demandeid].save();
	UICom.structure.ui[demandeid].resource.save();
}

function majDemEvalCompetence(nodeid) {
	var demande = $("*:has(>metadata[semantictag*='date-dem-eval'])",$(UICom.structure.ui[nodeid].node))[0];
	var demandeid = $(demande).attr("id");
	var text = " " + new Date().toLocaleString();
	UICom.structure.ui[demandeid].resource.text_node[LANGCODE].text(text);
	UICom.structure.ui[demandeid].resource.save();
}

function majDate(nodeid,datesemtag) {
	var date = $("*:has(>metadata[semantictag*='"+datesemtag+"'])",$(UICom.structure.ui[nodeid].node).parent())[0];
	var dateid = $(date).attr("id");
	var text = " " + new Date().toLocaleString();
	UICom.structure.ui[dateid].resource.text_node[LANGCODE].text(text);
	UICom.structure.ui[dateid].resource.save();
}

function majDateEvaluation(nodeid) {
	let evalens = $("*:has(>metadata[semantictag*=evaluation-enseignant])",$(UICom.structure.ui[nodeid].node));
	var date = $("*:has(>metadata[semantictag*=date-evaluation])",evalens)[0];
	var dateid = $(date).attr("id");
	var text = " " + new Date().toLocaleString();
	UICom.structure.ui[dateid].resource.text_node[LANGCODE].text(text);
	UICom.structure.ui[dateid].resource.save();
}


//=============================================================
//================= ENVOI NOTIFICATION ========================
//=============================================================

function sendNotification(subject,body,email) {
	var message = "";
//	var img = document.querySelector('#config-send-email-logo');
//	var imgB64 = getDataUrl(img)//	$("#image-window-body").html("");
//	var logo = "<img width='"+img.style.width+"' height='"+img.style.height+"' src=\""+imgB64+"\">";
//	message = logo + "<br>" + body;
	message = body;
	message = message.replace("##firstname##",USER.firstname);
	message = message.replace("##lastname##",USER.lastname);
	//------------------------------
	var xml ="<node>";
	xml +="<sender>"+$(USER.email_node).text()+"</sender>";
	xml +="<recipient>"+email+"</recipient>";
	xml +="<subject>"+USER.firstname+" "+USER.lastname+" "+subject+"</subject>";
	xml +="<message>"+message+"</message>";
	xml +="<recipient_cc></recipient_cc><recipient_bcc></recipient_bcc>";
	xml +="</node>";
	$.ajax({
		contentType: "application/xml",
		type : "POST",
		dataType : "xml",
		url : "../../../"+serverBCK+"/mail",
		data: xml,
		success : function(data) {
			$('#edit-window').modal('hide');
			alertHTML(karutaStr[LANG]['email-sent']);
		}
	});
}

//=============================================================
//       SUPPRESSION COMPÉTENCES DE LA SECTION MON BILAN
//=============================================================

function supprimerCompetenceMonBilan(uuid){
	var retour = false;
	if (confirm('ATTENTION. Cela va supprimer la compétence dans Mon bilan. Voulez-vous continuer?')) {
		retour = true;
		const code = UICom.structure.ui[uuid].getCode();
		const target = getTarget (UICom.structure.ui[uuid].node,'mes-competences');
		if (target.length>0) {
			targetid = $(target[0]).attr("id");
			const compnode = $("*:has(>metadata[semantictag*=page-competence-specification])",UICom.structure.ui[targetid].node);
			for (let i=0;i<compnode.length;i++){
				const nodeid = $(compnode[i]).attr("id");
				const nodecode = UICom.structure.ui[nodeid].getCode();
				if (nodecode==code)
					UIFactory.Node.remove(nodeid);
			}
			UIFactory.Node.reloadStruct();
		}
	} else {
		$('#delete-window').modal('hide');
		$('#wait-window').modal('hide');
	}
	return retour;
}

function supprimerFormationMonBilan(uuid){
	var retour = false;
	if (confirm('ATTENTION. Cela va supprimer la formation et les compétences dans Mes bilans par compétence. Voulez-vous continuer?')) {
		retour = true;
		const code = UICom.structure.ui[uuid].getCode();
		const target = getTarget (UICom.structure.ui[uuid].node,'mes-competences');
		if (target.length>0) {
			targetid = $(target[0]).attr("id");
			const compnode = $("*:has(>metadata[semantictag*=bilan-competences-FORMATION])",UICom.structure.ui[targetid].node);
			for (let i=0;i<compnode.length;i++){
				const nodeid = $(compnode[i]).attr("id");
				const nodecode = UICom.structure.ui[nodeid].getCode();
				if (nodecode==code)
					UIFactory.Node.remove(nodeid);
			}
			UIFactory.Node.reloadStruct();
		}
	} else {
		$('#delete-window').modal('hide');
		$('#wait-window').modal('hide');
	}
	return retour;
}

//==================================================================
//================= SPECIFIC FUNCTIONS =============================
//==================================================================

function specificEnterDisplayPortfolio()
{
	/*
	var html = "";
	html += "\n<!-- ==================== box ==================== -->";
	html += "\n<div id='temp-window' style='display:none'>";
	html += "\n		<div class='modal-content'>";
	html += "\n			<div style='padding:10px;height:50px;font-size:120%;background-color:#E4E3E3'>Vous devez accepter les conditions d'utilisation pour accéder à votre portfolio.</div>";
	html += "\n			<div id='temp-window-body' style='padding:10px'>";
	html += "\n			</div>";
	html += "\n		</div>";
	html += "\n</div>";
	html += "\n<!-- ============================================== -->";
	var tempwindow = document.createElement("DIV");
	tempwindow.setAttribute("class", "preview-window");
	tempwindow.innerHTML = html;
	$('body').append(tempwindow);
	const fc = $("*:has(>metadata[semantictag*=fichier-consentement])",g_portfolio_current).not(":has(>metadata-wad[submitted=Y])");
	for (let i=0; i<fc.length; i++){
		if (g_userroles[0]!='designer') {
			const nop = UICom.structure.ui[$(fc[i]).attr("id")].getView();
			UICom.structure.ui[$(fc[i]).attr("id")].displayAsmContext('temp-window-body',null,LANGCODE,true);
			var confirmbackdrop = document.createElement("DIV");
			confirmbackdrop.setAttribute("id", "confirmbackdrop");
			confirmbackdrop.setAttribute("class", "preview-backdrop");
			$('body').append(confirmbackdrop);
			$("#temp-window").show();
		}
	}
	*/
	
	const fc = $("*:has(>metadata[semantictag*=fichier-consentement])",g_portfolio_current).not(":has(>metadata-wad[submitted=Y])");
	if (fc.length!=0 && g_userroles[0]!='designer') {
		const nop = UICom.structure.ui[$(fc[0]).attr("id")].getView();
		var html = "";
		html += "\n<!-- ==================== box ==================== -->";
		html += "\n<div id='temp-window'>";
		html += "\n		<div class='modal-content'>";
		html += "\n			<div style='padding:10px;height:50px;font-size:120%;background-color:#E4E3E3'>Vous devez accepter les conditions d'utilisation pour accéder à votre portfolio.</div>";
		html += "\n			<div id='temp-window-body' style='padding:10px'>";
		html += "\n			</div>";
		html += "\n		</div>";
		html += "\n</div>";
		html += "\n<!-- ============================================== -->";
		var tempwindow = document.createElement("DIV");
		tempwindow.setAttribute("class", "preview-window");
		tempwindow.innerHTML = html;
		$('body').append(tempwindow);
		UICom.structure.ui[$(fc[0]).attr("id")].displayAsmContext('temp-window-body',null,LANGCODE,true);
		var confirmbackdrop = document.createElement("DIV");
		confirmbackdrop.setAttribute("id", "confirmbackdrop");
		confirmbackdrop.setAttribute("class", "preview-backdrop");
		$('body').append(confirmbackdrop);
		$("#temp-window").show();
	}
}


function specificDisplayPortfolios(){
	if (USER.other!="etudiant")
		throw 'non etudiant';
	else {
		let autoload = "";
		let nb_visibleportfolios = 0;
		for (var i=0;i<portfolios_list.length;i++){
			//--------------------------
			if (portfolios_list[i].visible || portfolios_list[i].ownerid==USER.id) {
				nb_visibleportfolios++;
			}
			if (portfolios_list[i].autoload) {
				autoload = portfolios_list[i].id;
			}
		}
		// -- if there is no autoload portfolio, we search if any has the role set in USER.other ---
		if (autoload=="") {
			for (var i=0;i<portfolios_list.length;i++){
				$.ajax({
					async:false,
					type : "GET",
					dataType : "xml",
					url : serverBCK_API+"/rolerightsgroups/all/users?portfolio="+portfolios_list[i].id,
					success : function(data) {
						if ($("rrg:has('user[id="+USER.id+"]'):has('label:contains(etudia)')",data).length>0)
							autoload = portfolios_list[i].id;
					}
				});
			}
		}
		//---------------------------------------------------------------------------------------------
		if (nb_visibleportfolios>0 || autoload!="" )
			if (nb_visibleportfolios>9 && portfoliosnotinfolders.length>9)
				UIFactory.PortfolioFolder.displayPortfolios('project-portfolios','false','list',portfoliosnotinfolders);
			else if (nb_visibleportfolios>1 && autoload=="")
				UIFactory.PortfolioFolder.displayPortfolios('card-deck-portfolios','false','card',portfoliosnotinfolders);
			else if (autoload!="") {
				display_main_page(autoload);
				UIFactory.PortfolioFolder.displayPortfolios('card-deck-portfolios','false','card',portfoliosnotinfolders);
			}
			else {  // nb_visibleportfolios == 1
				display_main_page(visibleid);
				UIFactory.PortfolioFolder.displayPortfolios('card-deck-portfolios','false','card',portfoliosnotinfolders);
			}
		else if (portfolios_list.length==1) {
			display_main_page(portfolios_list[0].id);
			UIFactory.PortfolioFolder.displayPortfolios('card-deck-portfolios','false','card',portfoliosnotinfolders);
		}
	}
}


//=========================================================
//==================Specific Vector Functions==============
//=========================================================

function numberVectorKAPC(enseignantid,type,date1,date2) {
	return searchVectorKAPC(enseignantid,type,date1,date2).length;
}

function searchVectorKAPC(enseignantid,type,date1,date2) {
	enseignantid = replaceVariable(enseignantid);
	let search = $("vector",searchVector(enseignantid,type));
	let result = [];
	if (date1!=null && date2!=null) {
		for (let i=0;i<search.length;i++) {
			const a7 = $("a7",search[i]).text();
			let date = a7;
			if (a7.indexOf("/")>-1) {
				date = a7.substring(a7.indexOf("/")+1);
			}
			if (date1<=date && date<=date2)
				result.push(search[i]);
		}
	} else {
		result = search;
	}
	return result;
}
//------------------- fonctions de recherche
function rechercheLibelle(destid,enseignantid,libelle) {
	enseignantid = replaceVariable(enseignantid);
	let search = $("vector",searchVector(enseignantid));
	let result = [];
	for (let i=0; i<search.length;i++) {
		const a8 = $("a8",search[i]).text();
		if (a8.indexOf(libelle)>-1) {
			const date = $("date",search[i]).text();
			const a1 = $("a1",search[i]).text();
			const a2 = $("a2",search[i]).text();
			const a3 = $("a3",search[i]).text();
			const a4 = $("a4",search[i]).text();
			const a5 = $("a5",search[i]).text();
			const a6 = $("a6",search[i]).text();
			const a7 = $("a7",search[i]).text();
			const a9 = $("a9",search[i]).text();
			const a10 = $("a10",search[i]).text();
			if (a2.indexOf('competence')>-1)
				displayCompetence(destid,date,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10);
			else if (a2.indexOf('feedback')>-1)
				displayFeedback(destid,date,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10);
			else
				if (a2.indexOf('-evaluation-done')>-1)
					displayEvaluationSoumise(destid,date,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10);
				else if (a2.indexOf('-evaluation')>-1)
					displayEvaluation(destid,date,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10);
		}
	}
}

function rechercheEtudiant(destid,enseignantid,etudiant) {
	enseignantid = replaceVariable(enseignantid);
	let search = $("vector",searchVector(enseignantid));
	let result = [];
	for (let i=0; i<search.length;i++) {
		const a6 = $("a6",search[i]).text();
		if (a8.indexOf(etudiant)>-1) {
			const date = $("date",search[i]).text();
			const a1 = $("a1",search[i]).text();
			const a2 = $("a2",search[i]).text();
			const a3 = $("a3",search[i]).text();
			const a4 = $("a4",search[i]).text();
			const a5 = $("a5",search[i]).text();
			const a7 = $("a7",search[i]).text();
			const a8 = $("a8",search[i]).text();
			const a9 = $("a9",search[i]).text();
			const a10 = $("a10",search[i]).text();
			if (a2.indexOf('competence')>-1)
				displayCompetence(destid,date,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10);
			else if (a2.indexOf('feedback')>-1)
				displayFeedback(destid,date,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10);
			else
				if (a2.indexOf('-evaluation-done')>-1)
					displayEvaluationSoumise(destid,date,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10);
				else if (a2.indexOf('-evaluation')>-1)
					displayEvaluation(destid,date,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10);
		}
	}
}
//-------------------

function buildSaveEvaluationVector(nodeid,pageid,type) {
	const original_pageid = pageid;
	const action = UICom.structure.ui[pageid].getLabel(null,'none');
	const enseignants = $("asmContext:has(metadata[semantictag='enseignant-select'])",UICom.structure.ui[pageid].node);
	const etudiant = $("text[lang='"+LANG+"']",$("asmContext:has(metadata[semantictag='prenom_nom'])",UICom.structure.ui[pageid].node)).text();
	let evalid = (type.indexOf("competence")>-1)? nodeid:pageid
	const note = $($("value",$("asmContext:has(metadata[semantictag='note-globale'])",UICom.structure.ui[evalid].node))[1]).text();
	const evaluation = $($("label[lang='"+LANG+"']",$("asmContext:has(metadata[semantictag='evaluation-element'])",$("asmUnitStructure:has(>metadata[semantictag='evaluation-enseignant'])",UICom.structure.ui[evalid].node)))[1]).text();
	let date_dem_eval = $("value",$("asmContext:has(metadata[semantictag='date-dem-eval'])",UICom.structure.ui[evalid].node)).text();
	if (date_dem_eval==null || date_dem_eval=='')
		date_dem_eval = new Date().getTime();
	const previewURL = getPreviewSharedURL(pageid);
	let candelete = "";
	for (let i=0;i<enseignants.length;i++){
		const enseignantid = $("code",enseignants[i]).text();
		candelete += (i==0) ? enseignantid:","+enseignantid;
		}
	for (let i=0;i<enseignants.length;i++){
		const enseignantid = $("code",enseignants[i]).text();
		const enseignantemail = $("value",enseignants[i]).text();
		saveVector(enseignantid,type,nodeid,original_pageid,previewURL,etudiant,date_dem_eval,action,note,evaluation,candelete);
		//----envoi courriel à l'enseigant -----
		if (g_variables['sendemail']!=null && g_variables['sendemail']=='true') {
			const object = "Demande étudiante";
			const body = " ##firstname## ##lastname## vous a fait une demande d'évaluation pour son eportfolio.";
			sendNotification(object,body,enseignantemail);
		}
	}
}

function buildSubmitEvaluationVector(nodeid,pageid,type) {
	const action = UICom.structure.ui[pageid].getLabel(null,'none');
	let actioncode = UICom.structure.ui[pageid].getCode();
	if (actioncode.indexOf('*')>-1)
		actioncode = actioncode.substring(0,actioncode.indexOf('*'))
	const etudiant = $("text[lang='"+LANG+"']",$("asmContext:has(metadata[semantictag='prenom_nom'])",UICom.structure.ui[pageid].node)).text();
	const etudiant_email = $("text[lang='"+LANG+"']",$("asmContext:has(metadata[semantictag='etudiant-courriel'])",UICom.structure.ui[pageid].node)).text();
	const matricule = $("text[lang='"+LANG+"']",$("asmContext:has(metadata[semantictag='etudiant-matricule'])",UICom.structure.ui[pageid].node)).text();
	let evalid = (type.indexOf("competence")>-1)? nodeid:pageid
	const note = $($("value",$("asmContext:has(metadata[semantictag='note-globale'])",UICom.structure.ui[evalid].node))[1]).text();
	const evaluation = $($("label[lang='"+LANG+"']",$("asmContext:has(metadata[semantictag='evaluation-element'])",UICom.structure.ui[evalid].node))[1]).text();
	let date_dem_eval = $("value",$("asmContext:has(metadata[semantictag='date-dem-eval'])",UICom.structure.ui[evalid].node)).text();
	if (date_dem_eval==null || date_dem_eval=='')
		date_dem_eval = new Date().getTime();
	const today = new Date().getTime();
	const previewURL = getPreviewSharedURL(pageid);
	saveVector(USER.username,type,nodeid,pageid,previewURL,matricule+"/"+etudiant,date_dem_eval+"/"+today,actioncode+"/"+action,note,evaluation);
	const object = "Évaluation";
	const body = action + "a été évalué(e).";
	//----envoi courriel à l'enseigant -----
	if (g_variables['sendemail']=='true') {
		const object = "Évaluation";
		const body = action+" a été évaluée.";
		sendNotification(object,body,etudiant_email);
	}
}

//------------------------

function buildSaveFeedbackVector(nodeid,pageid,type,sendemail) {
	const action = UICom.structure.ui[pageid].getLabel(null,'none');
	const enseignants = $("asmContext:has(metadata[semantictag='enseignant-select'])",UICom.structure.ui[pageid].node);
	const etudiant = $("text[lang='"+LANG+"']",$("asmContext:has(metadata[semantictag='prenom_nom'])",UICom.structure.ui[pageid].node)).text();
	const question = UICom.structure.ui[nodeid].getLabel(null,'none');
	const commentaires = UICom.structure.ui[nodeid].resource.getView(null,'vector');
	const commentaires1 = commentaires.replace(/(<br("[^"]*"|[^\/">])*)>/g, "$1/>");
	const commentaires2 = commentaires1.replace(/(<img("[^"]*"|[^\/">])*)>/g, "$1/>");
//	let date_dem_eval = $("text[lang='"+LANG+"']",$("asmContext:has(metadata[semantictag='date-dem-eval'])",UICom.structure.ui[pageid].node)).text();
//	if (date_dem_eval==null || date_dem_eval=='')
	let date_dem_eval = new Date().getTime();
	const previewURL = getPreviewSharedURL(pageid);
	let candelete = "";
	for (let i=0;i<enseignants.length;i++){
		const enseignantid = $("code",enseignants[i]).text();
		candelete += (i==0) ? enseignantid:","+enseignantid;
		}
	for (let i=0;i<enseignants.length;i++){
		const enseignantid = $("code",enseignants[i]).text();
		const enseignantemail = $("value",enseignants[i]).text();
		saveVector(enseignantid,type,nodeid,pageid,previewURL,etudiant,date_dem_eval,action,question,commentaires2,candelete);
		//----envoi courriel à l'enseigant -----
		if (sendemail!=null && sendemail=='true') {
			const object = "Demande étudiante";
			const body = " ##firstname## ##lastname## vous a fait une demande de feedback pour son eportfolio.";
			sendNotification(object,body,enseignantemail);
		}
	}
}

//------------------------

function buildSubmitFeebackVector(nodeid,pageid,type) {
	const action = UICom.structure.ui[pageid].getLabel(null,'none');
	const etudiant = $("text[lang='"+LANG+"']",$("asmContext:has(metadata[semantictag='prenom_nom'])",UICom.structure.ui[pageid].node)).text();
	const question = UICom.structure.ui[nodeid].getLabel(null,'none');
	const commentaires = UICom.structure.ui[nodeid].resource.getView(null,'vector');
	const commentaires1 = commentaires.replace(/(<br("[^"]*"|[^\/">])*)>/g, "$1/>");
	const commentaires2 = commentaires1.replace(/(<img("[^"]*"|[^\/">])*)>/g, "$1/>");
//	let date_dem_eval = $("text[lang='"+LANG+"']",$("asmContext:has(metadata[semantictag='date-dem-eval'])",UICom.structure.ui[pageid].node)).text();
//	if (date_dem_eval==null || date_dem_eval=='')
	let date_dem_eval = new Date().getTime();
	const previewURL = getPreviewSharedURL(pageid);
	deleteVector(null,null,nodeid)
	saveVector(USER.username,type,nodeid,pageid,previewURL,etudiant,date_dem_eval,action,question,commentaires2,USER.username);
}

//------------------------

function getPreviewSharedURL(uuid) {
	const email = "";
	const role = 'enseignant';
	const showtorole = 'enseignant';
	const sharerole = 'etudiant';
	const level = '2';
	const duration = '500';
	const urlS = serverBCK+'/direct?uuid='+uuid+'&role='+role+'&showtorole='+showtorole+'&l='+level+'&d='+duration+'&sharerole='+sharerole+'&type=showtorole';
	let url = "";
	$.ajax({
		async:false,
		type : "POST",
		dataType : "text",
		contentType: "application/xml",
		url : urlS,
		success : function (data){
			url = data;
		}

	});
	return url;
}

//=============================================================
//=============== EVALUATION COMPETENCE =======================
//=============================================================

function displayCompetence(destid,date,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10) {
	let html = "<tr>";
	html += "<td>"+a6+"</td>";
	const date_demande = new Date(parseInt(a7));
	html += "<td>"+ date_demande.toLocaleString()+"</td>";
	if (a8.indexOf("@")>0) // --- compétence personnalisée
		a8 = a8.substring(a8.indexOf("/")+1);
	html += "<td>"+a8+"<span class='button fas fa-binoculars' onclick=\"previewPageCompetence('"+a5+"',100,'previewURL',null,true)\" data-title='Aperçu' data-toggle='tooltip' data-placement='bottom' ></span></td>";
	html += "<td>"+a10+"</td>";
	html += "<td>"+a9+"</td>";
	html += "</tr>";
	$("#"+destid).append(html);
}

function supprimerEvaluationCompetence1(nodeid) { // --- sous section auto-evalaution-bilan-referentiel
	var type = "competence";
	deleteVector(null,type+'-evaluation',nodeid);
	deleteVector(null,type+'-evaluation-done',nodeid);
}

function supprimerEvaluationCompetence2(nodeid) { 
	let parent = $(UICom.structure.ui[nodeid].node).parent(); 
	nodeid = $(parent).attr('id'); // --- sous section auto-evalaution-bilan-referentiel
	var type = "competence";
	deleteVector(null,type+'-evaluation',nodeid);
	deleteVector(null,type+'-evaluation-done',nodeid);
}

function testDemanderEvaluationCompetence(nodeid) {
	let parentid = $(UICom.structure.ui[nodeid].node).parent().attr("id"); 
	const sct_soumissionid = $("*:has(>metadata[semantictag*=section-etudiant-soumission])",$(UICom.structure.ui[parentid].node)).attr("id");
	return testNotSubmitted(sct_soumissionid);
}

function testSiPartageCompetence(nodeid)
{
	const datedemandeid = $("*:has(>metadata[semantictag*=demande-eval])",$(UICom.structure.ui[nodeid].node)).attr("id");
	const date = UICom.structure.ui[datedemandeid].resource.getAttributes()['text'];
	if (date!="")
		return false;
	else
		return testDemanderEvaluationCompetence(nodeid);
}


function demanderEvaluationCompetence(nodeid) {
	let parentid = $(UICom.structure.ui[nodeid].node).parent().attr("id"); // --- sous section auto-evalaution-bilan-referentiel
	const sct_soumissionid = $("*:has(>metadata[semantictag*=section-etudiant-soumission])",$(UICom.structure.ui[parentid].node)).attr("id");
	const pageid = $("#page").attr('uuid');
	var type = "competence";
	const js1 = "majDemEvalCompetence('"+parentid+"')";
	const js2 = "buildSaveEvaluationVector('"+parentid+"','"+pageid+"','"+type+"-evaluation')";
	const text = "Attention vous ne pourrez plus faire de modifications sur cette demande. Voulez-vous continuer?";
	confirmSubmit(sct_soumissionid,false,js1,text,js2);
}

function modifierEvaluationCompetence(nodeid) {
	let parent = $(UICom.structure.ui[nodeid].node).parent().parent().parent(); // --- sous section auto-evalaution-bilan-referentiel
	const parentid = $(parent).attr("id");
	while ($(parent).prop("nodeName")!="asmUnit") {
		parent = $(parent).parent();
	}
	const pageid = $("text[lang='"+LANG+"']",$("asmContext:has(>metadata[semantictag='page-uuid'])",parent)).text();
	const type = "competence";
	deleteVector(null,type+'-evaluation',parentid);
	buildSaveEvaluationVector(parentid,pageid,type+'-evaluation');
}

function soumettreEvaluationCompetence(nodeid){ // --- sous section auto-evalaution-bilan-referentiel
	const type='competence';
	let parent = $(UICom.structure.ui[nodeid].node).parent().parent();
	while ($(parent).prop("nodeName")!="asmUnit") {
		parent = $(parent).parent();
	}
	const pageid = $("text[lang='"+LANG+"']",$("asmContext:has(>metadata[semantictag='page-uuid'])",parent)).text();
	deleteVector(null,type+"-evaluation",nodeid);
	if ($("vector",searchVector(null,type+"-evaluation-done",nodeid)).length==0) { 
		buildSubmitEvaluationVector(nodeid,pageid,type+"-evaluation-done");
		// montrer
		const sectid = $("*:has(>metadata[semantictag*=section-montrer-cacher])",$(UICom.structure.ui[pageid].node)).attr("id");
		if (sectid!=undefined)
			show(sectid);
	}
}

function resetEvaluationCompetence(nodeid){ // --- sous section auto-evalaution-bilan-referentiel
	const type='competence';
	let parent = $(UICom.structure.ui[nodeid].node).parent().parent().parent();
	while ($(parent).prop("nodeName")!="asmUnit") {
		parent = $(parent).parent();
	}
	const pageid = $("text[lang='"+LANG+"']",$("asmContext:has(>metadata[semantictag='page-uuid'])",parent)).text();
	deleteVector(null,type+'-evaluation-done',nodeid);
	buildSaveEvaluationVector(nodeid,pageid,type+'-evaluation');
}

//==================================
function previewPageCompetence(uuid,depth,type,langcode,edit) 
//==================================
{
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	if (type=='previewURL') {
		$.ajax({
			async:false,
			type : "GET",
			url : serverBCK+"/direct?i=" + uuid,
			success : function(data) {
				uuid = data;
			}
		});
	}
	var previewbackdrop = document.createElement("DIV");
	previewbackdrop.setAttribute("class", "preview-backdrop");
	previewbackdrop.setAttribute("id", "previewbackdrop-"+uuid);
	$('body').append(previewbackdrop);

	var previewwindow = document.createElement("DIV");
	previewwindow.setAttribute("id", "preview-"+uuid);
	previewwindow.setAttribute("class", "preview-window");
	previewwindow.setAttribute("preview-uuid", uuid);
	previewwindow.setAttribute("preview-edit", edit);
	previewwindow.innerHTML =  previewBox(uuid);
	$('body').append(previewwindow);
	$("#preview-"+uuid).hide();
	$("#preview-window-body-"+uuid).html("");
	let url = serverBCK_API+"/nodes/node/" + uuid + "?resources=true";
	$.ajax({
		type : "GET",
		dataType : "xml",
		url : url,
		success : function(data) {
			const portfolioid = $("text[lang='"+LANG+"']",$("asmContext:has(>metadata[semantictag='portfolio-uuid'])",data)).text();
			var header = "<button class='btn add-button' style='float:right' onclick=\"$('#"+portfolioid+"').remove();$('#preview-"+uuid+"').remove();$('#previewbackdrop-"+uuid+"').remove();\">"+karutaStr[LANG]['Close']+"</button>";
			$("#preview-window-header-"+uuid).html(header);
			$.ajax({
				type : "GET",
				dataType : "xml",
				url : serverBCK_API+"/portfolios/portfolio/" + portfolioid + "?resources=true",
				success : function(data) {
					UICom.parseStructure(data,false);
					if (edit==null)
						g_report_edit = false;
					else
						g_report_edit = edit;
					UICom.structure["ui"][uuid].displayNode('standard',UICom.structure['tree'][uuid],"preview-window-body-"+uuid,depth,langcode,g_report_edit);
					g_report_edit = g_edit;
					$("#preview-"+uuid).show();
					$("#previewbackdrop-"+uuid).show();
					window.scrollTo(0,0);
				},
				error : function() {
					var html = "";
					html += "<div>" + karutaStr[languages[langcode]]['error-notfound'] + "</div>";
					$("#preview-window-body-"+uuid).html(html);
					$("#previewbackdrop-"+uuid).show();
					$("#preview-window-"+uuid).show();
					window.scrollTo(0,0);
				}
			});
		},
		error : function() {
			var html = "";
			html += "<div>" + karutaStr[languages[langcode]]['error-notfound'] + "</div>";
			$("#preview-window-body-"+uuid).html(html);
			$("#previewbackdrop-"+uuid).show();
			$("#preview-window-"+uuid).show();
			window.scrollTo(0,0);
		}
	});
}
//===========================================================================
//=============== EVALUATION SAE STAGE ACTION PERIODE =======================
//===========================================================================

function displayEvaluation(destid,date,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10) {
	let html = "<tr>";
	html += "<td>"+a6+"</td>";
	const date_demande = new Date(parseInt(a7));
	html += "<td>"+ date_demande.toLocaleString()+"</td>";
	html += "<td>"+a8+"<span class='button fas fa-binoculars' onclick=\"previewPage('"+a5+"',100,'previewURL',null,true)\" data-title='Aperçu' data-toggle='tooltip' data-placement='bottom' ></span></td>";
	html += "<td>"+a10+"</td>";
	html += "<td>"+a9+"</td>";
	html += "</tr>";
	$("#"+destid).append(html);
}

function displayEvaluationSoumise(destid,date,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10) {
	let html = "<tr>";
	html += "<td>"+a6+"</td>";
	if (a7.indexOf("/")>-1) {
		const date_demande = new Date(parseInt(a7.substring(0,a7.indexOf("/"))));
		const date_evaluation = new Date(parseInt(a7.substring(a7.indexOf("/")+1)));
		html += "<td>"+ date_demande.toLocaleString()+"</td>";
		html += "<td>"+ date_evaluation.toLocaleString()+"</td>";
	} else {
		const date_demande = new Date(parseInt(a7));
		html += "<td>"+ date_demande.toLocaleString()+"</td>";
		html += "<td>"+ date +"</td>";
	}
	if (a8.indexOf("/")==0) // autre action
		a8 = a8.substring(a8.indexOf("/")+1);
	html += "<td>"+a8+"<span class='button fas fa-binoculars' onclick=\"previewPage('"+a4+"',100,'standard',null,true)\" data-title='Aperçu' data-toggle='tooltip' data-placement='bottom' ></span></td>";
	html += "<td>"+a10+"</td>";
	html += "<td>"+a9+"</td>";
	html += "</tr>";
	$("#"+destid).append(html);
}

function displayEvaluationExport(destid,date,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10) {
	let html = "<tr>";
	html += "<td>"+a6.substring(a6.indexOf("/")+1)+"</td>";
	html += "<td>"+ a6.substring(0,a6.indexOf("/")) +"</td>";
	if (a7.indexOf("/")>-1) {
		const date_evaluation = new Date(parseInt(a7.substring(a7.indexOf("/")+1)));
		html += "<td>"+ date_evaluation.toLocaleString()+"</td>";
	} else {
		const date_demande = new Date(parseInt(a7));
		html += "<td>"+ date +"</td>";
	}
	html += "<td>"+ a8.substring(0,a8.indexOf("/")) +"</td>";
	html += "<td>"+a10+"</td>";
	html += "<td>"+a9+"</td>";
	html += "</tr>";
	$("#"+destid).append(html);
}

//-------------------------- 

function demanderEvaluation(nodeid,parentid,sendemail) { // par l'étudiant
	let pageid = $("#page").attr('uuid');
	const semtag = UICom.structure.ui[pageid].semantictag;
	var type = "";
	if (semtag.indexOf('sae')>-1)
		type = 'sae';
	else if (semtag.indexOf('sie')>-1)
		type='sie';
	else if (semtag.indexOf('stage')>-1)
		type='stage';
	else if (semtag.indexOf('autre')>-1)
		type='action';
	else if (semtag.indexOf('competence')>-1)
		type='competence';
	else if (semtag.indexOf('periode-universite')>-1)
		type='periode-universite';
	else if (semtag.indexOf('periode-entreprise')>-1)
		type='periode-entreprise';
	else if (semtag.indexOf('rapport-memoire')>-1)
		type='rapport-memoire';
	const val = UICom.structure.ui[nodeid].resource.getValue();
	if (val=='1') {
		if (parentid!=null)
			nodeid = parentid;
		else
			nodeid = pageid;
		buildSaveEvaluationVector(pageid,pageid,type+'-evaluation',sendemail);
	} else {
		if (parentid!=null)
			pageid = parentid;
		deleteVector(null,type+'-evaluation',pageid);
	}
}

function demanderEvaluation2(nodeid,parentid,sendemail) { // par l'étudiant
	let pageid = $("#page").attr('uuid');
	const semtag = UICom.structure.ui[pageid].semantictag;
	var type = "";
	if (semtag.indexOf('sae')>-1)
		type = 'sae';
	else if (semtag.indexOf('sie')>-1)
		type='sie';
	else if (semtag.indexOf('stage')>-1)
		type='stage';
	else if (semtag.indexOf('autre')>-1)
		type='action';
	else if (semtag.indexOf('competence')>-1)
		type='competence';
	else if (semtag.indexOf('periode-universite')>-1)
		type='periode-universite';
	else if (semtag.indexOf('periode-entreprise')>-1)
		type='periode-entreprise';
	else if (semtag.indexOf('rapport-memoire')>-1)
		type='rapport-memoire';
	const js = "buildSaveEvaluationVector('"+nodeid+"','"+pageid+"','"+type+"-evaluation');majDemEvalSAE('"+nodeid+"')";
	const text = "Attention vous ne pourrez plus faire de modifications sur cette page. Voulez-vous continuer?";
	const section_etudiant_soumission_id = $("*:has(>metadata[semantictag='section-etudiant-soumission'])",UICom.structure.ui[pageid].node).attr("id");
	confirmSubmit(section_etudiant_soumission_id,false,js,text);
}

function removeDelete(nodeid,roletodelete){ //not used - user cannot update rights
	roles_by_role = {};
	var rights = UICom.structure.ui[nodeid].getRights();
	var roles = $("role",rights);
	if (roles.length>0) {
		for (var i=0;i<roles.length;i++){
			var rolename = $(roles[i]).attr("name");
			roles_by_role[rolename] = new RoleRights(roles[i],nodeid);
		}
	}
	var role = roles_by_role[roletodelete];
	role.rights['DL'] = 'N';
	RoleRights.save(roletodelete);

}


function modifierEvaluation(nodeid,sendemail) { // par l'enseignant
	let parent = UICom.structure.ui[nodeid].node;
	while ($(parent).prop("nodeName")!="asmUnit") {
		parent = $(parent).parent();
	}
	const pageid = $("text[lang='"+LANG+"']",$("asmContext:has(>metadata[semantictag='page-uuid'])",parent)).text();
	const semtag = UICom.structure.ui[pageid].semantictag;
	var type = "";
	if (semtag.indexOf('sae')>-1)
		type = 'sae';
	else if (semtag.indexOf('sie')>-1)
		type='sie';
	else if (semtag.indexOf('stage')>-1)
		type='stage';
	else if (semtag.indexOf('autre')>-1)
		type='action';
	else if (semtag.indexOf('competence')>-1)
		type='competence';
	else if (semtag.indexOf('periode-universite')>-1)
		type='periode-universite';
	else if (semtag.indexOf('periode-entreprise')>-1)
		type='periode-entreprise';
	else if (semtag.indexOf('rapport-memoire')>-1)
		type='rapport-memoire';
	deleteVector(null,type+'-evaluation',null,pageid);
	buildSaveEvaluationVector(pageid,pageid,type+'-evaluation',sendemail);
}


function soumettreEvaluation(nodeid,sendemail){ // par l'enseignant
	let pageid = nodeid;
	const semtag = UICom.structure.ui[pageid].semantictag;
	var type = "";
	if (semtag.indexOf('sae')>-1)
		type = 'sae';
	else if (semtag.indexOf('sie')>-1)
		type='sie';
	else if (semtag.indexOf('stage')>-1)
		type='stage';
	else if (semtag.indexOf('autre')>-1)
		type='action';
	else if (semtag.indexOf('periode-universite')>-1)
		type='periode-universite';
	else if (semtag.indexOf('periode-entreprise')>-1)
		type='periode-entreprise';
	else if (semtag.indexOf('rapport-memoire')>-1)
		type='rapport-memoire';
	else if (semtag.indexOf('competence')>-1) {
		type='competence';
		pageid = $("#page").attr('uuid');
	}
	deleteVector(null,type+'-evaluation',null,pageid);
	if ($("vector",searchVector(null,type+"-evaluation-done",nodeid,pageid)).length==0) {
		buildSubmitEvaluationVector(nodeid,pageid,type+"-evaluation-done",sendemail);
		// montrer
		const sectid = $("*:has(>metadata[semantictag*=section-montrer-cacher])",$(UICom.structure.ui[pageid].node)).attr("id");
		if (sectid!=undefined)
			show(sectid);
	}
}
function supprimerEvaluation(nodeid){  // parl'étudiant
	const pageid = $("#page").attr('uuid');
	const semtag = UICom.structure.ui[pageid].semantictag;
	var type = "";
	if (semtag.indexOf('sae')>-1)
		type = 'sae';
	else if (semtag.indexOf('sie')>-1)
		type='sie';
	else if (semtag.indexOf('stage')>-1)
		type='stage';
	else if (semtag.indexOf('autre')>-1)
		type='action';
	else if (semtag.indexOf('competence')>-1)
		type='competence';
	else if (semtag.indexOf('periode-universite')>-1)
		type='periode-universite';
	else if (semtag.indexOf('periode-entreprise')>-1)
		type='periode-entreprise';
	else if (semtag.indexOf('rapport-memoire')>-1)
		type='rapport-memoire';
//	deleteVector(null,type+"-evaluation",nodeid);
	deleteVector(null,type+"-evaluation",null,pageid); // supprimer aussi les demandes de feedback
}

function resetEvaluation(nodeid){
	const pageid = $("#page").attr('uuid');
	const semtag = UICom.structure.ui[pageid].semantictag;
	var type = "";
	if (semtag.indexOf('sae')>-1)
		type = 'sae';
	else if (semtag.indexOf('sie')>-1)
		type='sie';
	else if (semtag.indexOf('stage')>-1)
		type='stage';
	else if (semtag.indexOf('autre')>-1)
		type='action';
	else if (semtag.indexOf('competence')>-1)
		type='competence';
	else if (semtag.indexOf('periode-universite')>-1)
		type='periode-universite';
	else if (semtag.indexOf('periode-entreprise')>-1)
		type='periode-entreprise';
	else if (semtag.indexOf('rapport-memoire')>-1)
		type='rapport-memoire';
	deleteVector(null,type+"-evaluation-done",nodeid);
	buildSaveEvaluationVector(nodeid,pageid,type+'-evaluation');
}

//==================== Autres actions
function confirmsoumettreAutres(nodeid,semtag) {
	document.getElementById('delete-window-body').innerHTML = "L'envoi supprime les droits d'édition de tous les éléments de la page. Cette action est irréversible.<br> Voulez-vous continuer ?";
	var buttons = "<button class='btn' onclick=\"javascript:$('#delete-window').modal('hide');\">" + karutaStr[LANG]["Cancel"] + "</button>";
	buttons += "<button class='btn btn-danger' onclick=\"$('#delete-window').modal('hide');soumettreAutres('"+nodeid+"','"+semtag+"')\">Envoyer</button>";
	document.getElementById('delete-window-footer').innerHTML = buttons;
	$('#delete-window').modal('show');
}

function soumettreAutres(nodeid,semtag) {
	submit(nodeid,UICom.structure.ui[nodeid].submitall=='Y');
	const pageid = $("#page").attr('uuid');
	var autres = $("*:has(>metadata[semantictag*='"+semtag+"'])",UICom.structure.ui[pageid].node);
	for (var i=0;i<autres.length;i++){
		const autresid = $(autres).attr("id")
		submit(autresid,UICom.structure.ui[autresid].submitall=='Y');
	}
}

//=================================================
//=============== FEEDBACK ========================
//=================================================

function displayFeedback(destid,date,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10) {
	let html = "<tr>";
	html += "<td>"+a6+"</td>";
	html += "<td>"+a8+"<span class='button fas fa-binoculars' onclick=\"previewPage('"+a5+"',100,'previewURL',null,true)\" data-title='Aperçu' data-toggle='tooltip' data-placement='bottom' ></span></td>";
	const date_demande = new Date(parseInt(a7));
	html += "<td>"+ date_demande.toLocaleString()+"</td>";
	html += "<td>"+a9+"</td>";
	html += "<td>"+a10+"</td>";
//	html += "<td><span class='button' onclick=\"soumettreFeedback('"+a3+"','"+a4+"','"+a2+"','"+g_variables['sendemail']+"')\" data-title='Envoyer' data-toggle='tooltip' data-placement='bottom' ><i class='fa fa-paper-plane' aria-hidden='true'></i></span></td>";
	html += "</tr>";
	$("#"+destid).append(html);
}

function demanderFeedback(nodeid){
	//---------------------------
	const pageid = $("#page").attr('uuid');
	//---------------------------
	const semtag = UICom.structure.ui[pageid].semantictag;
	var type = "";
	if (semtag.indexOf('sae')>-1)
		type = 'sae';
	else if (semtag.indexOf('sie')>-1)
		type='sie';
	else if (semtag.indexOf('stage')>-1)
		type='stage';
	else if (semtag.indexOf('autre')>-1)
		type='action';
	else if (semtag.indexOf('competence')>-1)
		type='competence';
	else if (semtag.indexOf('periode-universite')>-1)
		type='periode-universite';
	else if (semtag.indexOf('periode-entreprise')>-1)
		type='periode-entreprise';
	else if (semtag.indexOf('rapport-memoire')>-1)
		type='rapport-memoire';
	deleteVector(null,type+'-feedback',nodeid);
	buildSaveFeedbackVector(nodeid,pageid,type+"-feedback");
}

function modifierFeedback(nodeid) { // par l'enseignant
	//---------------------------
	let parent = UICom.structure.ui[nodeid].node;
	while ($(parent).prop("nodeName")!="asmUnit") {
		parent = $(parent).parent();
	}
	const pageid = $("text[lang='"+LANG+"']",$("asmContext:has(>metadata[semantictag='page-uuid'])",parent)).text();
	//---------------------------
	const semtag = UICom.structure.ui[pageid].semantictag;
	var type = "";
	if (semtag.indexOf('sae')>-1)
		type = 'sae';
	else if (semtag.indexOf('sie')>-1)
		type='sie';
	else if (semtag.indexOf('stage')>-1)
		type='stage';
	else if (semtag.indexOf('autre')>-1)
		type='action';
	else if (semtag.indexOf('competence')>-1)
		type='competence';
	else if (semtag.indexOf('periode-universite')>-1)
		type='periode-universite';
	else if (semtag.indexOf('periode-entreprise')>-1)
		type='periode-entreprise';
	else if (semtag.indexOf('rapport-memoire')>-1)
		type='rapport-memoire';
	deleteVector(null,type+'-feedback',nodeid);
	buildSaveFeedbackVector(nodeid,pageid,type+'-feedback');
}

function supprimerFeedback(nodeid){
	//---------------------------
	const pageid = $("#page").attr('uuid');
	//---------------------------
	const semtag = UICom.structure.ui[pageid].semantictag;
	var type = "";
	if (semtag.indexOf('sae')>-1)
		type = 'sae';
	else if (semtag.indexOf('sie')>-1)
		type='sie';
	else if (semtag.indexOf('stage')>-1)
		type='stage';
	else if (semtag.indexOf('autre')>-1)
		type='action';
	else if (semtag.indexOf('competence')>-1)
		type='competence';
	else if (semtag.indexOf('periode-universite')>-1)
		type='periode-universite';
	else if (semtag.indexOf('periode-entreprise')>-1)
		type='periode-entreprise';
	else if (semtag.indexOf('rapport-memoire')>-1)
		type='rapport-memoire';
	deleteVector(null,type+"-feedback",nodeid);
}

function soumettreFeedback(nodeid){
	//---------------------------
	let parent = UICom.structure.ui[nodeid].node;
	while ($(parent).prop("nodeName")!="asmUnit") {
		parent = $(parent).parent();
	}
	const pageid = $("text[lang='"+LANG+"']",$("asmContext:has(>metadata[semantictag='page-uuid'])",parent)).text();
	//---------------------------
	const semtag = UICom.structure.ui[pageid].semantictag;
	var type = "";
	if (semtag.indexOf('sae')>-1)
		type = 'sae';
	else if (semtag.indexOf('sie')>-1)
		type='sie';
	else if (semtag.indexOf('stage')>-1)
		type='stage';
	else if (semtag.indexOf('autre')>-1)
		type='action';
	else if (semtag.indexOf('competence')>-1)
		type='competence';
	else if (semtag.indexOf('periode-universite')>-1)
		type='periode-universite';
	else if (semtag.indexOf('periode-entreprise')>-1)
		type='periode-entreprise';
	else if (semtag.indexOf('rapport-memoire')>-1)
		type='rapport-memoire';
	buildSubmitFeebackVector(nodeid,pageid,type+"-feedback-done");
}

//====================================================





//------------------ TEST -------------




function numberOf(a1,a2) {
	const nb = searchVector(a1,a2);
	return nb;
}


//============== 1.2 =========================
function cacherColonnesVides(){
	var colspan = 7;
	if (g_variables['auto-eval']==undefined || g_variables['auto-eval'].length==0){
		$("td.auto-eval").hide();
		colspan--;
	}
	if (g_variables['eval-pair']==undefined || g_variables['eval-pair'].length==0){
		$("td.eval-pair").hide();
		colspan--;
	}
	if (g_variables['eval-tuteur']==undefined || g_variables['eval-tuteur'].length==0) {
		$("td.eval-tuteur").hide();
		colspan--;
	}
	if (g_variables['note']==undefined || g_variables['note'].length==0) {
		$("td.note").css('visibility','hidden');
	}
	$("td.colsvides").attr('colspan',colspan);

}



function OLDbuildSaveVectorKAPC(nodeid,pageid,type) {
	const enseignants = $("asmContext:has(metadata[semantictag='enseignant-select'])",UICom.structure.ui[pageid].node);
	const today = new Date().getTime();

	for (let i=0;i<enseignants.length;i++){
		const enseignantid = $("code",enseignants[i]).text();
		if (type=='competence-evaluation')
			pageid = nodeid;
		saveVector(enseignantid,type,nodeid,pageid,g_portfolioid,USER.username,today);
//		UIFactory.Portfolio.sharePortfolio(g_portfolioid,"enseignant",enseignantid);
	}
}



function OLDbuildSubmitVectorKAPC(nodeid,pageid,type) {
	const today = new Date().getTime();
	const portfolioidnodes = $(".portfolioid",document);
	const tab = $(portfolioidnodes).map(function() {return $(this).text();}).get();
	let portfolioid ="";
	for (let i=0;i<tab.length;i++){
		let pageids = tab[i].split("_");
		if (pageids[0]==nodeid)
			portfolioid = pageids[1];
	}
	saveVector(USER.username,type,nodeid,pageid,portfolioid,USER.username,today);
}

function OLDdemanderEvaluation(nodeid,parentid) {
	let pageid = $("#page").attr('uuid');
	const semtag = UICom.structure.ui[pageid].semantictag;
	var type = "";
	if (semtag.indexOf('sae')>-1)
		type = 'sae';
	else if (semtag.indexOf('stage')>-1)
		type='stage';
	else if (semtag.indexOf('autre')>-1)
		type='action';
	else if (semtag.indexOf('competence')>-1)
		type='competence';
	else if (semtag.indexOf('periode-universite')>-1)
		type='periode-universite';
	else if (semtag.indexOf('periode-entreprise')>-1)
		type='periode-entreprise';
	else if (semtag.indexOf('rapport-memoire')>-1)
		type='rapport-memoire';
	const val = UICom.structure.ui[nodeid].resource.getValue();
	if (val=='1') {
		if (parentid!=null)
			nodeid = parentid;
		else
			nodeid = pageid;
		buildSaveVectorKAPC(nodeid,pageid,type+'-evaluation');
	} else {
		if (parentid!=null)
			pageid = parentid;
		deleteVector(null,type+'-evaluation',pageid);
	}
}

function soumettreEvaluation2(nodeid){
	soumettreEvaluation(nodeid);
}
/*
function OLDsoumettreEvaluation(nodeid){
	let pageid = nodeid;
	const semtag = UICom.structure.ui[pageid].semantictag;
	var type = "";
	if (semtag.indexOf('sae')>-1)
		type = 'sae';
	else if (semtag.indexOf('stage')>-1)
		type='stage';
	else if (semtag.indexOf('autre')>-1)
		type='action';
	else if (semtag.indexOf('periode-universite')>-1)
		type='periode-universite';
	else if (semtag.indexOf('periode-entreprise')>-1)
		type='periode-entreprise';
	else if (semtag.indexOf('rapport-memoire')>-1)
		type='rapport-memoire';
	else if (semtag.indexOf('competence')>-1) {
		type='competence';
		pageid = $("#page").attr('uuid');
	}
	if ($("vector",searchVector(null,type+"-evaluation-done",nodeid,pageid)).length==0) {
		buildSubmitVectorKAPC(nodeid,pageid,type+"-evaluation-done");
		// montrer
		const sectid = $("*:has(>metadata[semantictag*=section-montrer-cacher])",$(UICom.structure.ui[pageid].node)).attr("id");
		if (sectid!=undefined)
			show(sectid);
	}
}

function OLDnumberVectorKAPC(enseignantid,type1,type2,date1,date2) {
	let tab1 = searchVectorEvalFB(enseignantid,type1,type2,date1,date2);
	let tab2 = [];
	let tab3 = [];
	for (let i=0;i<tab1.length;i++) {
		const elts = tab1[i].split("/");
		let pageid = elts[1];
		const search = $("vector",searchVector(null,type2,pageid));
		if (search.length==0)
			tab2.push(tab1[i]);
	}
	if (type1.indexOf('feedback')>-1) { // on vérifie que la page n'est pas soumise'
		for (let i=0;i<tab2.length;i++){
			const elts = tab2[i].split("/");
			let nodeid = elts[0];
			let pageid = elts[1];
			const search1 = $("vector",searchVector(null,type2,nodeid));
			const search2 = $("vector",searchVector(null,type2.replace('feedback','evaluation'),pageid));
			if (search1.length==0 && search2.length==0)
				tab3.push(tab2[i]);
		}
	}
	return (type1.indexOf('feedback')>-1)? tab3.length:tab2.length;
}

function OLDsearchVectorKAPC(enseignantid,type1,type2,date1,date2) {
	let tableau = searchVectorEvalFB(enseignantid,type1,type2,date1,date2);
	let result = [];
	for (let i=0;i<tableau.length;i++){
		const elts = tableau[i].split("/");
		if (result.indexOf(elts[2])<0)
		result.push(elts[2]);
	}
	return result;
}
*/

function searchVectorEvalFB(enseignantid,type1,type2,date1,date2,enseignant2id) {
	let search1 = $("vector",searchVector(enseignantid,type1));
	if(enseignant2id!=null)
		search1 = $("vector",searchVector(enseignantid,type1,null,null,null,enseignant2id));
	let tableau = [];
	// on ajoute tous les uuids qui ont type1
	for (let i=0;i<search1.length;i++){
		let nodeid = $("a3",search1[i]).text();
		let pageid = $("a4",search1[i]).text();
		let portfolioid = $("a5",search1[i]).text();
		if (date1!=null || date2!=null) {
			let date = $("a7",search1[i]).text();
			if (date1!=null && date2!=null && date1<date && date<date2+86400000) {
					if (tableau.indexOf(nodeid+"/"+pageid+"/"+portfolioid)<0)
						tableau.push(nodeid+"/"+pageid+"/"+portfolioid);
			} else if (date1!=null && date2==null && date1<date) {
					if (tableau.indexOf(nodeid+"/"+pageid+"/"+portfolioid)<0)
						tableau.push(nodeid+"/"+pageid+"/"+portfolioid);
			} else if (date1==null && date2!=null && date<date2+86400000) {
				if (tableau.indexOf(nodeid+"/"+pageid+"/"+portfolioid)<0)
					tableau.push(nodeid+"/"+pageid+"/"+portfolioid);
			} 
		} else if (tableau.indexOf(nodeid+"/"+pageid+"/"+portfolioid)<0)
			tableau.push(nodeid+"/"+pageid+"/"+portfolioid);
	}
	if (type2!=null && type2!=""){
		// on retire tous les uuids qui ont type2 et le même nodeid
		const search2 = $("vector",searchVector(enseignantid,type2));
		for (let i=0;i<search2.length;i++){
			let nodeid = $("a3",search2[i]).text();
			let pageid = $("a4",search2[i]).text();
			let portfolioid = $("a5",search2[i]).text();
			const indx = tableau.indexOf(nodeid+"/"+pageid+"/"+portfolioid);
			if (indx>-1)
				tableau.splice(indx,1);
		}
	}
	return tableau;
}

function searchVectorActionKAPC(enseignantid,type1,type2,date1,date2,portfolioid) {
	let tableau = searchVectorEvalFB(enseignantid,type1,type2,date1,date2);
	let result = [];
	for (let i=0;i<tableau.length;i++){
		const elts = tableau[i].split("/");
		if (result.indexOf(elts[1])<0 && elts[2]==portfolioid)
		result.push(elts[1]);
	}
	return result;
}

//=====================================================
function reloadPreviewPage() {
	let previewpageid = $(".preview-window").attr('preview-uuid');
	$('#preview-'+previewpageid).remove();
	$('#previewbackdrop-'+previewpageid).remove();
	previewPage(previewpageid,100,"",null,g_report_edit); 
}



//=======================================
function addBackdrop(id)
{
	$('#edit-window').modal('hide');
	if (id==null)
		id = "";
	var confirmbackdrop = document.createElement("DIV");
	confirmbackdrop.setAttribute("id", "backdrop"+id);
	confirmbackdrop.setAttribute("class", "preview-backdrop");
	$('body').append(confirmbackdrop);
}

function delBackdrop(id)
{
	if (id==null)
		id = "";
	$('#backdrop'+id).remove();
}

//============= passage 1.2 vers 1.3
function getKPAC12Login(str){
	str = replaceBatchVariable(str);
	let result = "";
	result = str.substring(str.lastIndexOf("portfolio-")+10);
	return result;
}

//# sourceURL=kapc1.3.js

