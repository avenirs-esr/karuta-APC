// === version 1.4 2024/07/15 ===
// 1.3.5.2 valeurs du vecteur enrichi json (formation,cohorte)
// 1.3.5.1 test si submitall dans soumettreAutres()
// 1.3.4 fermeture balises xml <br> et <img> dans feedback
// 1.3.3 évaluation compétence
// 1.3.2 test demande compétence
// 1.3.1 test si demande à un pair ou pro
// 1.3.0 nouvelle gestion des vecteurs
// 1.2.1.affichage date



//=============== UTILS ==================

function getType(semtag)
{
	let type = "";
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
	else if (semtag.indexOf('pp-')>-1 || semtag.indexOf('projet-pro')>-1)
		type='projet-pro';
	return type;
}

function loadNodeAndGetSemtag(uuid)
{
	let semtag="";
	$.ajax({
		async:false,
		type : "GET",
		dataType : "xml",
		url : serverBCK_API+"/nodes/node/" + uuid + "?resources=true",
		uuid : uuid,
		success : function(data) {
			semtag = $($("metadata",data)[0]).attr('semantictag');
		}
	});
	return semtag;
}

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

function removeBackdropAndRelaod()
{
	$("#temp-window").remove();
	$('#confirmbackdrop').remove();
	fill_main_page();
}

function getPreviewSharedAPCURL(uuid,role) {
	if (role.indexOf('-select')>0)
		role = role.substring(0,role.indexOf('-select'));
	const sharerole = 'etudiant';
	const level = '2';
	const duration = '5000';
	const urlS = serverBCK+'/direct?uuid='+uuid+'&role='+role+'&showtorole='+role+'&l='+level+'&d='+duration+'&sharerole='+sharerole+'&type=showtorole';
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

function testConseillerCodeNotEmpty(uuid) {
	if (uuid == null)
		uuid = $("#page").attr('uuid');
	const conseiller = $("asmContext:has(metadata[semantictag='cons-interne-select'])",UICom.structure.ui[uuid].node);
	return (conseiller.length>0);
}

function testTuteurCodeNotEmpty(uuid) {
	if (uuid == null)
		uuid = $("#page").attr('uuid');
	const tuteur = $("asmContext:has(metadata[semantictag='tuteur-select'])",UICom.structure.ui[uuid].node);
	return (tuteur.length>0);
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

function testFeedbacksNonRepondus(pageid) {
	if (pageid == null)
		pageid = $("#page").attr('uuid');
	const nodes = $("*:has(>metadata[semantictag='commentaires-feedback'])",UICom.structure.ui[pageid].node).has("asmResource[xsi_type!='context'][xsi_type!='nodeRes'] > text[lang="+LANG+"]:not(:empty)");
	return (nodes.length==0) ? true:false;;
}

function testSiDateEcheancePassee (page) {
	const node = $("*:has(>metadata[semantictag='date-echeance'])",page);
	const date = $("utc",node).text();
	let result = false;
	if (date<new Date().getTime())
		result = true;
	return result;
}

function testSiEnvoiConseillerExterne(nodeid) {
	let result = true;
	const sections = $("*:has(>metadata[semantictag='section-const-externe'])",UICom.structure.ui[nodeid].node)
	if (sections.length>0) {
		for (let i=0; i<sections.length; i++){
			const submitted = ($("metadata-wad",sections[i]).attr('submitted')==undefined)?'N':$("metadata-wad",sections[i]).attr('submitted');
			if (submitted!="Y")
				result = false;
		}
	}
	return result;
}


//====================================================

function setVariable_code (node)
{
	let variable = $("code",$("asmResource[xsi_type='nodeRes']",$(node))).text();
	let code = $("code",$("asmResource[xsi_type='Get_Resource']",$(node))).text();
	g_variables[variable+"_code"] = code;
}

//======================================================================================
//============= Mise à jour Sections Profil ============================================
//======================================================================================

//==================================
function setEtuInfos(uuid) 
//==================================
{
	const semtag = UICom.structure.ui[uuid].semantictag;
	const value = UICom.structure.ui[uuid].resource.getView();
	//------------------------
	const portfolioAlternance = UIFactory.Portfolio.search_bycode(replaceVariable("portfolio-alternance-etu-##accountlogin##"));
	if (portfolioAlternance!="") {
		const portfolioAlternanceCode = $($("code",portfolioAlternance)[0]).text();
		setInfo(value,semtag,portfolioAlternanceCode);
	}
	//------------------------
	const portfolioProjetPro = UIFactory.Portfolio.search_bycode(replaceVariable("portfolio-pp-etu-##accountlogin##"));
	if (portfolioProjetPro!="") {
		const portfolioProjetProCode = $($("code",portfolioProjetPro)[0]).text();
		setInfo(value,semtag,portfolioProjetProCode);
	}
}

//==================================
function setInfo(value,semtag,portfoliocode) 
//==================================
{
	$.ajax({
		async:false,
		type : "GET",
		dataType : "xml",
		url : serverBCK_API+"/portfolios/portfolio/code/" + portfoliocode +"?resources=true",
		success : function(data) {
			const node = $("asmContext:has(metadata[semantictag*='"+semtag+"'])",data);
			const nodeid = $(node).attr('id');
			var resource = $("asmResource[xsi_type='Field']",node);
			$("text",resource).text(value);
			var data = "<asmResource xsi_type='Field'>" + $(resource).html() + "</asmResource>";
			var strippeddata = data.replace(/xmlns=\"http:\/\/www.w3.org\/1999\/xhtml\"/g,"");  // remove xmlns attribute
			//-------------------
			$.ajax({
				async : false,
				type : "PUT",
				contentType: "application/xml",
				dataType : "text",
				data : strippeddata,
				url : serverBCK_API+"/resources/resource/" + nodeid,
				success : function() {
				},
				error : function() {
				}
			});
		}
	});
}

//======================================================================================
//============= Mise à jour SAE/STAGE/ACTION/Compétence ================================
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
	//------------------------
	const select_traces1 = $("*:has(>metadata[semantictag*='select-trace'])",g_portfolio_current);
	const portfolioAlternance = UIFactory.Portfolio.getdata_bycode(replaceVariable("portfolio-alternance-etu-##accountlogin##"),true);
	const select_traces2 = $("*:has(>metadata[semantictag*='select-trace'])",portfolioAlternance);
	const portfolioProjetPro = UIFactory.Portfolio.getdata_bycode(replaceVariable("portfolio-pp-etu-##accountlogin##"),true);
	const select_traces3 = $("*:has(>metadata[semantictag*='select-trace'])",portfolioProjetPro);
	const select_traces = select_traces1.add(select_traces2).add(select_traces3);
	//------------------------
	for (let i=0;i<traces.length;i++){
		const traceid = $(traces[i]).attr('id');
		const code = UICom.structure.ui[traceid].getCode();
		const label = UICom.structure.ui[traceid].getLabel(null,'none');
		let present = false;
		for (let j=0;j<select_traces.length;j++){
			const select_trace_code = $($("code",$("asmResource[xsi_type!='context'][xsi_type!='nodeRes']",select_traces[j]))).text();
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
	//------------------------
	const portfolioAPC = UIFactory.Portfolio.getdata_bycode(replaceVariable("portfolio-etu-##accountlogin##"),true);
	const select_traces1 = $("*:has(>metadata[semantictag*='select-trace'])",portfolioAPC);
	const portfolioAlternance = UIFactory.Portfolio.getdata_bycode(replaceVariable("portfolio-alternance-etu-##accountlogin##"),true);
	const select_traces2 = $("*:has(>metadata[semantictag*='select-trace'])",portfolioAlternance);
	const portfolioProjetPro = UIFactory.Portfolio.getdata_bycode(replaceVariable("portfolio-pp-etu-##accountlogin##"),true);
	const select_traces3 = $("*:has(>metadata[semantictag*='select-trace'])",portfolioProjetPro);
	const select_traces = select_traces1.add(select_traces2).add(select_traces3);
	//------------------------
	let deletable = true;
	for (let j=0;j<select_traces.length;j++){
		const select_trace_code = $($("code",$("asmResource[xsi_type!='context'][xsi_type!='nodeRes']",select_traces[j]))).text();
		if (select_trace_code==code && !($(select_traces[j]).attr('delete')=='Y')){
			deletable = false;
			break;
		}
	}
	if (deletable) {
		for (let j=0;j<select_traces.length;j++){
			const select_trace_code = $($("code",$("asmResource[xsi_type!='context'][xsi_type!='nodeRes']",select_traces[j]))).text();
			const deletable = ($(select_traces[j].node).attr('delete')=='Y')? true:false;
			if (select_trace_code==code) {
				to_be_deleted = confirm("ATTENTION - Cette trace est utilisée dans le portfolio. Voulez-vous vraiment la supprimer?");
				if (to_be_deleted) {
					const all_to_be_deleted = confirm("ATTENTION - Voulez-vous supprimer toutes les références à cette trace ?");
					if (all_to_be_deleted) {
						for (let k=0;k<select_traces1.length;k++){
							const select_trace_code = $($("code",$("asmResource[xsi_type!='context'][xsi_type!='nodeRes']",select_traces1[k]))).text();
							if (select_trace_code==code) {
								const uuid = $(select_traces1[k]).attr("id");
								UICom.structure.ui[uuid] = null;
								$("#"+uuid,g_portfolio_current).remove();
								UICom.DeleteNode(uuid);
							}
						}
						for (let k=0;k<select_traces2.length;k++){
							const select_trace_code = $($("code",$("asmResource[xsi_type!='context'][xsi_type!='nodeRes']",select_traces2[k]))).text();
							if (select_trace_code==code) {
								const uuid = $(select_traces2[k]).attr("id");
								UICom.structure.ui[uuid] = null;
								$("#"+uuid,g_portfolio_current).remove();
								UICom.DeleteNode(uuid);
							}
						}
						for (let k=0;k<select_traces3.length;k++){
							const select_trace_code = $($("code",$("asmResource[xsi_type!='context'][xsi_type!='nodeRes']",select_traces3[k]))).text();
							if (select_trace_code==code) {
								const uuid = $(select_traces3[k]).attr("id");
								UICom.structure.ui[uuid] = null;
								$("#"+uuid,g_portfolio_current).remove();
								UICom.DeleteNode(uuid);
							}
						}
						UIFactory.Node.reloadUnit();
					}
					else
						to_be_deleted = false;
				}
				break;
			}
		}
	} else {
		to_be_deleted = false;
		alert("Cette trace est utilisée dans un élement de porfolio déjà soumis.");
	}
	return to_be_deleted;
}

function verifier_supprimer_collections(nodeid) {
	let to_be_deleted = true;
	//------------------------
	const collection_traces1 = $("*:has(>metadata[semantictag*='trace-etudiant'])",g_portfolio_current);
	const portfolioAlternance = UIFactory.Portfolio.getdata_bycode(replaceVariable("portfolio-alternance-etu-##accountlogin##"),true);
	const collection_traces2 = $("*:has(>metadata[semantictag*='trace-etudiant'])",portfolioAlternance);
	const portfolioProjetPro = UIFactory.Portfolio.getdata_bycode(replaceVariable("portfolio-pp-etu-##accountlogin##"),true);
	const collection_traces3 = $("*:has(>metadata[semantictag*='trace-etudiant'])",portfolioProjetPro);
	const collection_traces = collection_traces1.add(collection_traces2).add(collection_traces3);
	//------------------------
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
	let js = replaceVariable("setNodeCodeLabel2(##currentnode##,##lastimported##)",UICom.structure.ui[nodeid]);
	eval(js);
}

function setNodeCodeLabel2(nodeid,targetid){
	if (nodeid!=targetid) {
		if(UICom.structure.ui[nodeid].node_code==undefined) // in case of access before node ndisplay
			UICom.structure.ui[nodeid].setMetadata();
		if(UICom.structure.ui[targetid].node_code==undefined) // in case of access before node ndisplay
			UICom.structure.ui[nodeid].setMetadata();
		//-----------------------
		$(UICom.structure.ui[targetid].code_node).text($(UICom.structure.ui[nodeid].code_node).text());
		$(UICom.structure.ui[targetid].label_node[LANGCODE]).text($(UICom.structure.ui[nodeid].label_node[LANGCODE]).text());
		UICom.structure.ui[targetid].save();
	}
}

function demandeEnregistree(nodeid){
	alert('Demande enregistrée')
}

function demandeSupprimee(nodeid){
	alert('Demande supprimée')
}

function ifSubmittedDeleleDelParentButton(nodeid){
	if (UICom.structure.ui[nodeid].submitted=='Y') {
		const parentid = $(UICom.structure.ui[nodeid].node).parent().attr("id");
		$("#del-"+parentid).remove();
	}
	return true;
}
//---------------
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

function resetDemEval(nodeid) {
	var demande = $("*:has(>metadata[semantictag*='date-dem-eval'])",$(UICom.structure.ui[nodeid].node))[0];
	var demandeid = $(demande).attr("id");
	UICom.structure.ui[demandeid].value_node.text('0');
	UICom.structure.ui[demandeid].resource.text_node[LANGCODE].text("");
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


//----------------
function majResText(nodeid,semtag,text) {
	var res = $("*:has(>metadata[semantictag*='"+semtag+"'])",$(UICom.structure.ui[nodeid].node).parent())[0];
	var resid = $(res).attr("id");
	UICom.structure.ui[resid].resource.text_node[LANGCODE].text(text);
	UICom.structure.ui[resid].resource.save();
}

function majDateEmail (nodeid,sharetoemail) {
	var email_envoi = $("*:has(>metadata[semantictag*='email-envoi'])",$(UICom.structure.ui[nodeid].node))[0];
	var email_envoiid = $(email_envoi).attr("id");
	majResText(email_envoiid,'email-envoi',sharetoemail);
	var question = $("*:has(>metadata[semantictag*='question'])",$(UICom.structure.ui[nodeid].node))[0];
	var questionid = $(question).attr("id");
	submit(questionid);
	$("#del-"+nodeid).hide();
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


//=========================================================
//================== KAPC Vector Functions=================
//=========================================================

function KAPCevaluation(previewURL,date_demande,date_eval,code,label,matricule,note,evaluation,commentaires,email_etudiant)
{
	this.date_demande = date_demande;
	this.date_eval = date_eval;
	this.code = code;
	this.label = label;
	this.matricule = matricule;
	this.email_etudiant = email_etudiant;
	this.note = note;
	this.evaluation = evaluation;
	this.commentaires = commentaires;
	this.previewURL = previewURL;
}

function KAPCfeedback(previewURL,date_demande,date_eval,code,label,matricule,question,reponse,email_etudiant)
{
	this.date_demande = date_demande;
	this.date_eval = date_eval;
	this.code = code;
	this.label = label;
	this.email_etudiant = email_etudiant;
	this.question = question;
	this.reponse = reponse;
	this.matricule = matricule;
	this.previewURL = previewURL;
}


function numberVectorKAPC(enseignantid,type,date1,date2) {
	return searchVectorKAPC(enseignantid,type,date1,date2).length;
}

function searchVectorKAPC(enseignantid,type,date1,date2) {
	enseignantid = replaceVariable(enseignantid);
	let search = $("vector",searchVector(enseignantid,type));
	let result = [];
	if (date1!=null && date2!=null) {
		for (let i=0;i<search.length;i++) {
			a5 = JSON.parse($("a5",search[i]).text());
//			const date = new Date(parseInt(a5.date_eval));
			const date = a5.date_eval;
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
	for (let i=0; i<search.length;i++) {
		const a5 = JSON.parse($("a5",search[i]).text());
		if (a5.label.indexOf(libelle)>-1) {
			const date = $("date",search[i]).text();
			const a1 = $("a1",search[i]).text();
			const a2 = $("a2",search[i]).text();
			const a3 = $("a3",search[i]).text();
			const a4 = $("a4",search[i]).text();
			const a6 = $("a6",search[i]).text();
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

function rechercheEtudiant(destid,enseignantid,etudiant) {
	enseignantid = replaceVariable(enseignantid);
	let search = $("vector",searchVector(enseignantid));
	for (let i=0; i<search.length;i++) {
		const a6 = $("a6",search[i]).text();
		if (a6.indexOf(etudiant)>-1) {
			const date = $("date",search[i]).text();
			const a1 = $("a1",search[i]).text();
			const a2 = $("a2",search[i]).text();
			const a3 = $("a3",search[i]).text();
			const a4 = $("a4",search[i]).text();
			const a5 = JSON.parse($("a5",search[i]).text());
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
//-----------evaluation--------

function buildSaveEvaluationVector(nodeid,pageid,type,evaluateur) {
	//----------------------
	if (evaluateur==null)
		evaluateur='enseignant-select';
	const actionlabel = UICom.structure.ui[pageid].getLabel(null,'none');
	let actioncode = UICom.structure.ui[pageid].getCode();
	if (actioncode.indexOf('*')>-1)
		actioncode = actioncode.substring(0,actioncode.indexOf('*'));
	const enseignants = $("asmContext:has(metadata[semantictag='"+evaluateur+"'])",UICom.structure.ui[pageid].node);
	let etudiant = $("text[lang='"+LANG+"']",$("asmContext:has(metadata[semantictag='prenom_nom'])",UICom.structure.ui[pageid].node)).text();
	if (etudiant=="") {
		etudiant = $("text[lang='"+LANG+"']",$("asmContext:has(metadata[semantictag='prenom-etudiant'])",g_portfolio_current)).text();
		etudiant += " " + $("text[lang='"+LANG+"']",$("asmContext:has(metadata[semantictag='nom-famille-etudiant'])",g_portfolio_current)).text();
	}
	let evalid = (type.indexOf("competence")>-1)? nodeid:pageid
	const note = $($("value",$("asmContext:has(metadata[semantictag='note-globale'])",UICom.structure.ui[evalid].node))[1]).text();
	const evaluation = $($("label[lang='"+LANG+"']",$("asmContext:has(metadata[semantictag='evaluation-element'])",$("asmUnitStructure:has(>metadata[semantictag='evaluation-enseignant'])",UICom.structure.ui[evalid].node)))[1]).text();
	let date_dem_eval = $("value",$("asmContext:has(metadata[semantictag='date-dem-eval'])",UICom.structure.ui[evalid].node)).text();
	if (date_dem_eval==null || date_dem_eval=='' || date_dem_eval=='0')
		date_dem_eval = new Date().getTime();
	const previewURL = getPreviewSharedAPCURL(pageid,evaluateur);
	const matricule = $("text[lang='"+LANG+"']",$("asmContext:has(metadata[semantictag='etudiant-matricule'])",UICom.structure.ui[pageid].node)).text();
	const formation = "?";
	const cohorte = "?";
	let a5 = JSON.stringify(new KAPCevaluation(previewURL,date_dem_eval,"",actioncode,actionlabel,matricule,note,evaluation,""));
	//----------------------
	let candelete = "";
	for (let i=0;i<enseignants.length;i++){
		const enseignantid = $("code",enseignants[i]).text();
		candelete += (i==0) ? enseignantid:","+enseignantid;
		}
	for (let i=0;i<enseignants.length;i++){
		const enseignantid = $("code",enseignants[i]).text();
		const enseignantemail = $("value",enseignants[i]).text();
		saveVector(enseignantid,type,nodeid,pageid,a5,etudiant,formation,cohorte,"","",candelete);
		//----envoi courriel à l'enseignant -----
		if (g_variables['sendemail']!=null && g_variables['sendemail']=='true') {
			const object = "Demande étudiante";
			const body = " ##firstname## ##lastname## vous a fait une demande d'évaluation pour son eportfolio.";
			sendNotification(object,body,enseignantemail);
		}
	}
}

function buildSubmitEvaluationVector(nodeid,pageid,type,evaluateur) {
	if (evaluateur==null)
		evaluateur='enseignant-select';
	const actionlabel = UICom.structure.ui[pageid].getLabel(null,'none');
	let actioncode = UICom.structure.ui[pageid].getCode();
	if (actioncode.indexOf('*')>-1)
		actioncode = actioncode.substring(0,actioncode.indexOf('*'))
	let etudiant = $("text[lang='"+LANG+"']",$("asmContext:has(metadata[semantictag='prenom_nom'])",UICom.structure.ui[pageid].node)).text();
	if (etudiant=="") {
		etudiant = $("text[lang='"+LANG+"']",$("asmContext:has(metadata[semantictag='prenom-etudiant'])",g_portfolio_current)).text();
		etudiant += " " + $("text[lang='"+LANG+"']",$("asmContext:has(metadata[semantictag='nom-famille-etudiant'])",g_portfolio_current)).text();
	}
	const etudiant_email = $("text[lang='"+LANG+"']",$("asmContext:has(metadata[semantictag='etudiant-courriel'])",UICom.structure.ui[pageid].node)).text();
	const evalid = (type.indexOf("competence")>-1)? nodeid:pageid
	const note = $($("value",$("asmContext:has(metadata[semantictag='note-globale'])",UICom.structure.ui[evalid].node))[1]).text();
	const evaluation = $($("label[lang='"+LANG+"']",$("asmContext:has(metadata[semantictag='evaluation-element'])",UICom.structure.ui[evalid].node))[1]).text();
	let date_dem_eval = $("value",$("asmContext:has(metadata[semantictag='date-dem-eval'])",UICom.structure.ui[evalid].node)).text();
	if (date_dem_eval==null || date_dem_eval=='')
		date_dem_eval = new Date().getTime();
	const today = new Date().getTime();
	const previewURL = getPreviewSharedAPCURL(pageid,evaluateur);
	const matricule = $("text[lang='"+LANG+"']",$("asmContext:has(metadata[semantictag='etudiant-matricule'])",UICom.structure.ui[pageid].node)).text();
	const formation = "?";
	const cohorte = "?";
	const a5 = JSON.stringify(new KAPCevaluation(previewURL,date_dem_eval,today,actioncode,actionlabel,matricule,note,evaluation,"",etudiant_email));
	saveVector(USER.username,type,nodeid,pageid,a5,etudiant,formation,cohorte,"","");
	//----envoi courriel à l'enseigant -----
	if (g_variables['sendemail']!=null && g_variables['sendemail']=='true') {
		const object = "Évaluation";
		const body = actionlabel+" a été évaluée.";
		sendNotification(object,body,etudiant_email);
	}
}

//---------feedback---------------

function buildSaveFeedbackVector(nodeid,pageid,type,evaluateur) {
	if (evaluateur==null)
		evaluateur='enseignant-select';
	const actionlabel = UICom.structure.ui[pageid].getLabel(null,'none');
	let actioncode = UICom.structure.ui[pageid].getCode();
	if (actioncode.indexOf('*')>-1)
		actioncode = actioncode.substring(0,actioncode.indexOf('*'))
	const enseignants = $("asmContext:has(metadata[semantictag='"+evaluateur+"'])",UICom.structure.ui[pageid].node);
	let etudiant = $("text[lang='"+LANG+"']",$("asmContext:has(metadata[semantictag='prenom_nom'])",UICom.structure.ui[pageid].node)).text();
	if (etudiant=="") {
		etudiant = $("text[lang='"+LANG+"']",$("asmContext:has(metadata[semantictag='prenom-etudiant'])",g_portfolio_current)).text();
		etudiant += " " + $("text[lang='"+LANG+"']",$("asmContext:has(metadata[semantictag='nom-famille-etudiant'])",g_portfolio_current)).text();
	}
	const etudiant_email = $("text[lang='"+LANG+"']",$("asmContext:has(metadata[semantictag='etudiant-courriel'])",UICom.structure.ui[pageid].node)).text();
	const question = UICom.structure.ui[nodeid].getLabel(null,'none');
	const reponse = UICom.structure.ui[nodeid].resource.getView(null,'vector');
	const reponse1 = reponse.replace(/(<br("[^"]*"|[^\/">])*)>/g, "$1/>");
	const reponse2 = reponse1.replace(/(<img("[^"]*"|[^\/">])*)>/g, "$1/>");
	const feedback_metadata = $("metadata",UICom.structure.ui[nodeid].node);
	const date_dem_eval = $(feedback_metadata).attr("date-demande");
	const previewURL = getPreviewSharedAPCURL(pageid,evaluateur);
	const matricule = $("text[lang='"+LANG+"']",$("asmContext:has(metadata[semantictag='etudiant-matricule'])",UICom.structure.ui[pageid].node)).text();
	const formation = "?";
	const cohorte = "?";
	const a5 = JSON.stringify(new KAPCfeedback(previewURL,date_dem_eval,"",actioncode,actionlabel,matricule,question,reponse2,"",etudiant_email));
	let candelete = "";
	for (let i=0;i<enseignants.length;i++){
		const enseignantid = $("code",enseignants[i]).text();
		candelete += (i==0) ? enseignantid:","+enseignantid;
		}
	for (let i=0;i<enseignants.length;i++){
		const enseignantid = $("code",enseignants[i]).text();
		const enseignantemail = $("value",enseignants[i]).text();
		saveVector(enseignantid,type,nodeid,pageid,a5,etudiant,formation,cohorte,"","",candelete);
		//----envoi courriel à l'enseigant -----
		if (g_variables['sendemail']!=null && g_variables['sendemail']=='true') {
			const object = "Demande étudiante";
			const body = " ##firstname## ##lastname## vous a fait une demande de feedback pour son eportfolio.";
			sendNotification(object,body,enseignantemail);
		}
	}
}

//------------------------

function buildSubmitFeebackVector(nodeid,pageid,type,evaluateur) {
	if (evaluateur==null)
		evaluateur='enseignant-select';
	const action = UICom.structure.ui[pageid].getLabel(null,'none');
	const actionlabel = UICom.structure.ui[pageid].getLabel(null,'none');
	let actioncode = UICom.structure.ui[pageid].getCode();
	if (actioncode.indexOf('*')>-1)
		actioncode = actioncode.substring(0,actioncode.indexOf('*'))
	let etudiant = $("text[lang='"+LANG+"']",$("asmContext:has(metadata[semantictag='prenom_nom'])",UICom.structure.ui[pageid].node)).text();
	if (etudiant=="") {
		etudiant = $("text[lang='"+LANG+"']",$("asmContext:has(metadata[semantictag='prenom-etudiant'])",g_portfolio_current)).text();
		etudiant += " " + $("text[lang='"+LANG+"']",$("asmContext:has(metadata[semantictag='nom-famille-etudiant'])",g_portfolio_current)).text();
	}
	const question = UICom.structure.ui[nodeid].getLabel(null,'none');
	const date_dem_eval = $(UICom.structure.ui[nodeid].node).attr("date-demande");
	const reponse = UICom.structure.ui[nodeid].resource.getView(null,'vector');
	const reponse1 = reponse.replace(/(<br("[^"]*"|[^\/">])*)>/g, "$1/>");
	const reponse2 = reponse1.replace(/(<img("[^"]*"|[^\/">])*)>/g, "$1/>");
	const date_evaluation = new Date().getTime();
	const previewURL = getPreviewSharedAPCURL(pageid,evaluateur);
	const matricule = $("text[lang='"+LANG+"']",$("asmContext:has(metadata[semantictag='etudiant-matricule'])",UICom.structure.ui[pageid].node)).text();
	const formation = "?";
	const cohorte = "?";
	const a5 = JSON.stringify(new KAPCfeedback(previewURL,date_dem_eval,date_evaluation,actioncode,actionlabel,matricule,question,reponse2,""));
	deleteVector(null,null,nodeid)
	saveVector(USER.username,type,nodeid,pageid,a5,etudiant,formation,cohorte,"","");
	//----envoi courriel à l'enseigant -----
	if (g_variables['sendemail']!=null && g_variables['sendemail']=='true') {
		const object = "Évaluation";
		const body = actionlabel+" - Il y a une réponse  à votre de demande de feedback.";
		sendNotification(object,body,etudiant_email);
	}
}

//------------------------


//=============================================================
//=============== EVALUATION COMPETENCE =======================
//=============================================================

function displayCompetence(destid,date,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10) {
	a5 = JSON.parse(a5);
	const date_demande = new Date(parseInt(a5.date_demande));
	let html = "<tr>";
	html += "<td>"+a6+"</td>";
	html += "<td>"+ date_demande.toLocaleString()+"</td>";
	if (a5.label.indexOf("@")>0) // --- compétence personnalisée
		a5.label = a5.label.substring(a8.indexOf("/")+1);
	html += "<td>"+a5.label+"<span class='button fas fa-binoculars' onclick=\"previewPageCompetence('"+a5.previewURL+"',100,'previewURL',null,true)\" data-title='Aperçu' data-toggle='tooltip' data-placement='bottom' ></span></td>";
	html += "<td>"+a5.evaluation+"</td>";
	html += "<td>"+a5.note+"</td>";
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
		const sectid = $("*:has(>metadata[semantictag*=section-montrer-cacher])",$(UICom.structure.ui[nodeid].node)).attr("id");
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
	//---------------------
	var previewbackdrop = document.createElement("DIV");
	previewbackdrop.setAttribute("class", "preview-backdrop");
	previewbackdrop.setAttribute("id", "previewbackdrop-"+uuid);
	$('body').append(previewbackdrop);
	//-----------------------------
	var previewwindow = document.createElement("DIV");
	previewwindow.setAttribute("id", "preview-"+uuid);
	previewwindow.setAttribute("class", "preview-window");
	previewwindow.setAttribute("preview-uuid", uuid);
	previewwindow.setAttribute("preview-edit", edit);
	previewwindow.innerHTML =  previewBox(uuid);
	$('body').append(previewwindow);
	$("#preview-"+uuid).hide();
	$("#preview-window-body-"+uuid).html("");
	//-----------------------------
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
					UICom.structure.ui[uuid].displayNode('standard',UICom.structure.tree[uuid],"preview-window-body-"+uuid,depth,langcode,g_report_edit);
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
	a5 = JSON.parse(a5);
	const date_demande = new Date(parseInt(a5.date_demande));
	let html = "<tr>";
	html += "<td>"+a6+"</td>";
	html += "<td>"+ date_demande.toLocaleString()+"</td>";
	html += "<td>"+a5.label+"<span class='button fas fa-binoculars' onclick=\"previewPage('"+a5.previewURL+"',100,'previewURL',null,true)\" data-title='Aperçu' data-toggle='tooltip' data-placement='bottom' ></span></td>";
	html += "<td>"+a5.evaluation+"</td>";
	if (a2.indexOf('periode')<0 && a2.indexOf('rapport')<0)
		html += "<td>"+a5.note+"</td>";
	html += "</tr>";
	$("#"+destid).append(html);
}

function displayEvaluationSoumise(destid,date,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10) {
	a5 = JSON.parse(a5);
	const date_demande = new Date(parseInt(a5.date_demande));
	const date_evaluation = new Date(parseInt(a5.date_eval));
	let html = "<tr>";
	html += "<td>"+a6+"</td>";
	html += "<td>"+ date_demande.toLocaleString()+"</td>";
	html += "<td>"+ date_evaluation.toLocaleString()+"</td>";
	if (a8.indexOf("/")==0) // autre action
		a8 = a8.substring(a8.indexOf("/")+1);
	html += "<td>"+a5.label+"<span class='button fas fa-binoculars' onclick=\"previewPage('"+a5.previewURL+"',100,'previewURL',null,true)\" data-title='Aperçu' data-toggle='tooltip' data-placement='bottom' ></span></td>";
	html += "<td>"+a5.evaluation+"</td>";
	if (a2.indexOf('periode')<0 && a2.indexOf('rapport')<0)
		html += "<td>"+a5.note+"</td>";
	html += "</tr>";
	$("#"+destid).append(html);
}

function displayEvaluationExport(destid,date,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10) {
	a5 = JSON.parse(a5);
	const date_evaluation = new Date(parseInt(a5.date_eval));
	let html = "<tr>";
	html += "<td>"+ a6 +"</td>";
	html += "<td>"+a5.matricule+"</td>";
	html += "<td>"+ date_evaluation.toLocaleString()+"</td>";
	html += "<td>"+ a5.code +"</td>";
	html += "<td>"+a5.evaluation+"</td>";
	if (a2.indexOf('periode')<0 && a2.indexOf('rapport')<0)
		html += "<td>"+a5.note+"</td>";
	html += "</tr>";
	$("#"+destid).append(html);
}

//-------------------------- 

function demanderEvaluation2(nodeid,vers) { // par l'étudiant
	let pageid = $("#page").attr('uuid');
	const flagid = $("*:has(>metadata[semantictag='flag-"+vers+"'])",UICom.structure.ui[pageid].node).attr("id");
	const semtag = UICom.structure.ui[pageid].semantictag;
	const type = getType(semtag);
	if (vers==null)
		vers = 'enseignant';
	let js = "buildSaveEvaluationVector('"+nodeid+"','"+pageid+"','"+type+"-evaluation','"+vers+"-select');majDemEvalSAE('"+nodeid+"')";
	if (vers!=null) {
		js += ";submit('"+flagid+"')";
	}
	const text = "Attention vous ne pourrez plus faire de modifications sur cette page. Voulez-vous continuer?";
	const section_etudiant_soumission_id = $("*:has(>metadata[semantictag='section-etudiant-soumission'])",UICom.structure.ui[pageid].node).attr("id");
	deleteVector(null,type+'-evaluation',null,pageid);
	confirmSubmit(section_etudiant_soumission_id,false,js,text);
}

function modifierEvaluation(nodeid) { // par l'enseignant
	let parent = UICom.structure.ui[nodeid].node;
	while ($(parent).prop("nodeName")!="asmUnit") {
		parent = $(parent).parent();
	}
	const pageid = $("text[lang='"+LANG+"']",$("asmContext:has(>metadata[semantictag='page-uuid'])",parent)).text();
	const semtag = UICom.structure.ui[pageid].semantictag;
	const type = getType(semtag);
	deleteVector(null,type+'-evaluation',null,pageid);
	buildSaveEvaluationVector(pageid,pageid,type+'-evaluation');
	UIFactory.Node.reloadUnit();
}


function soumettreEvaluation(nodeid){ // par l'enseignant
	let pageid = nodeid;
	const semtag = UICom.structure.ui[pageid].semantictag;
	const type = getType(semtag);
	if (semtag.indexOf('competence')>-1) {
		pageid = $("#page").attr('uuid');
	}
	deleteVector(null,type+'-evaluation',null,pageid);
	deleteVector(null,type+'-feedback',null,pageid); // supprimer aussi les demandes de feedback
	if ($("vector",searchVector(null,type+"-evaluation-done",nodeid,pageid)).length==0) {
		buildSubmitEvaluationVector(nodeid,pageid,type+"-evaluation-done");
		// montrer
		const sectid = $("*:has(>metadata[semantictag*=section-montrer-cacher])",$(UICom.structure.ui[pageid].node)).attr("id");
		if (sectid!=undefined)
			show(sectid);
	}
}
function supprimerEvaluation(nodeid){ 
	const pageid = $("#page").attr('uuid');
	const semtag = UICom.structure.ui[pageid].semantictag;
	const type = getType(semtag);
	deleteVector(null,type+"-evaluation",null,pageid);
	deleteVector(null,type+"-feedback",null,pageid); // supprimer aussi les demandes de feedback
}

function resetEvaluation(nodeid){
	const pageid = $("#page").attr('uuid');
	const semtag = UICom.structure.ui[pageid].semantictag;
	const type = getType(semtag);
	deleteVector(null,type+"-evaluation-done",nodeid);
	resetDemEval(nodeid);
	UIFactory.Node.reloadUnit();
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

function displayFeedback(destid,date,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,type) {
	if (type==null)
		type="none";
	a5 = JSON.parse(a5);
	const reponse = a5.reponse.split("|");
	let html = "<tr>";
	html += "<td>"+a6+"</td>";
	html += "<td>"+a5.label+"<span class='button fas fa-binoculars' onclick=\"previewPage('"+a5.previewURL+"',100,'previewURL',null,true)\" data-title='Aperçu' data-toggle='tooltip' data-placement='bottom' ></span></td>";
	const date2 = (a2.indexOf("-done")>-1)? new Date(parseInt(a5.date_eval)):new Date(parseInt(a5.date_demande));
	html += "<td>"+ date2.toLocaleString()+"</td>";
	html += "<td>"+a5.question+"</td>";
	const separateur = (reponse[1]!="")?" - ":"";
	html += "<td>"+reponse[0]+"</td>";
	if (type=='repondu')
		html += "<td><i data-toggle='tooltip' data-title='Supprimer du tableau de bord' class='fas fa-trash-alt' onclick=\"supprimerFeedbackRepondu('"+a3+"','"+a4+"')\"></i></td>";
	if (type=='repondre') {
		const js = "";
		html += "<td><i  data-toggle='tooltip' data-title='Supprimer du tableau de bord'class='fas fa-trash-alt' onclick=\"supprimerFeedbackRepondre('"+a3+"')\"></i></td>";
	}
	html += "</tr>";
	$("#"+destid).append(html);
}

function demanderFeedback(nodeid){
	//---------------------------
	var feedback_metadata = $("metadata",UICom.structure.ui[nodeid].node);
	const today = new Date().getTime();
	$(feedback_metadata).attr("date-demande",today);
	UICom.UpdateMetadata(nodeid);
	//---------------------------
	const pageid = $("#page").attr('uuid');
	//---------------------------
	const semtag = UICom.structure.ui[pageid].semantictag;
	const type = getType(semtag);
	deleteVector(null,type+'-feedback',nodeid);
	demandeEnregistree();
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
	const type = getType(semtag);
	deleteVector(null,type+'-feedback',nodeid);
	buildSaveFeedbackVector(nodeid,pageid,type+'-feedback');
	demandeEnregistree();
	UIFactory.Node.reloadUnit();
}

function supprimerFeedback(nodeid){ // par l'étudiant
	//---------------------------
	const pageid = $("#page").attr('uuid');
	//---------------------------
	const semtag = UICom.structure.ui[pageid].semantictag;
	const type = getType(semtag);
	deleteVector(null,type+"-feedback",nodeid);
	demandeSupprimee();
}

function supprimerFeedbacks(pageid) { // par l'étudiant
	const semtag = UICom.structure.ui[pageid].semantictag;
	const type = getType(semtag);
	deleteVector(null,type+"-feedback",null,pageid);
}

function supprimerFeedbackRepondre(nodeid){ // // par l'enseignant dans le tableau de bord

	const js = "const pageid = $('#page').attr('uuid');const semtag = UICom.structure.ui[pageid].semantictag;const type = getType(semtag);deleteVector(null,type+'-feedback','"+nodeid+"');UIFactory.Node.reloadUnit();";

	document.getElementById('delete-window-body').innerHTML = karutaStr[LANG]["confirm-delete"];
	var buttons = "<button class='btn' onclick=\"$('#delete-window').modal('hide');\">" + karutaStr[LANG]["Cancel"] + "</button>";
	buttons += "<button class='btn btn-danger' onclick=\""+js+";$('#delete-window').modal('hide')\">" + karutaStr[LANG]["button-delete"] + "</button>";
	document.getElementById('delete-window-footer').innerHTML = buttons;
	$('#delete-window').modal('show');
}

function supprimerFeedbackRepondu(nodeid,pageid) { // par l'enseignant dans le tableau de bord
	const js = "const semtag = loadNodeAndGetSemtag('"+pageid+"');const type = getType(semtag);deleteVector(null,type+'-feedback-done','"+nodeid+"');UIFactory.Node.reloadUnit();"

	document.getElementById('delete-window-body').innerHTML = karutaStr[LANG]["confirm-delete"];
	var buttons = "<button class='btn' onclick=\"$('#delete-window').modal('hide');\">" + karutaStr[LANG]["Cancel"] + "</button>";
	buttons += "<button class='btn btn-danger' onclick=\""+js+";$('#delete-window').modal('hide')\">" + karutaStr[LANG]["button-delete"] + "</button>";
	document.getElementById('delete-window-footer').innerHTML = buttons;
	$('#delete-window').modal('show');
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
	const type = getType(semtag);
	buildSubmitFeebackVector(nodeid,pageid,type+"-feedback-done");
}



//====================================================

function afficherDateAjout(nodeid) {
	const utc = $(UICom.structure.ui[nodeid].resource.lastmodified_node).text();
	const dateModif = new Date(parseInt(utc)).toLocaleString();
	const parentid= $($(UICom.structure.ui[nodeid].node).parent()).attr("id");
	$("#extra-"+nodeid).html("<div style='font-size:70%;margin-left:10px'>Dernière modification : "+dateModif+"</div>");
	return true;
}


//# sourceURL=apc14.js

