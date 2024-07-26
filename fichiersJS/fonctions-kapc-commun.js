// fonctions communes utilisées par apc, projet-pro, alternance


// ---------------------------------------

function UserInfo(login,email,name){
	this.login = login;
	this.email = email;
	this.name = name;
}

function getItemUserInfos(pageid,semtag) {
	const name = $("label[lang='"+LANG+"']",$("asmContext:has(metadata[semantictag='"+semtag+"'])",UICom.structure.ui[pageid].node)).text().replaceAll("&nbsp;"," ");
	const email = $("value",$("asmContext:has(metadata[semantictag='"+semtag+"'])",UICom.structure.ui[pageid].node)).text();
	const login = $("code",$("asmContext:has(metadata[semantictag='"+semtag+"'])",UICom.structure.ui[pageid].node)).text();
	return new UserInfo(login,email,name);
}

//---------------------------------------

function getResourceVectorView(semtag,node) {
	const eltid =$("asmContext:has(metadata[semantictag='"+semtag+"'])",node).attr("id");
	const elt = (eltid==undefined) ? "" : UICom.structure.ui[eltid].resource.getView(null,'vector');
	return elt;

}

// ---------------------------------------

function getButtonSharedURL(uuid,role,sharerole,x) {
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
			if (x!=undefined)
				url = serverURL+"/karuta/htm/public.htm?i="+data+"&amp;x=1&amp;lang="+languages[LANGCODE];
			else
				url = serverURL+"/karuta/htm/public.htm?i="+data+"&amp;lang="+languages[LANGCODE];
		}

	});
	return "<a style='margin-left:10px' href='"+url+"'>cliquez ici</a>";
}

function getPortfolioURL(portfoliocode) {
	const portfolioid = UIFactory.Portfolio.getid_bycode(portfoliocode,false);
	const url = window.location.toString() + "?i=" + portfolioid;
	return "<a style='margin-left:10px' href='"+url+"'>cliquez ici</a>";
}

function getPortfolioSharedURL(uuid,role,sharerole) {
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
			url = window.location.toString() + "?ii=" + data;
		}

	});
	return "<a style='margin-left:10px;font-size:120%' href='"+url+"'>cliquez ici</a>";
}


//---------------------------------------

function updateResourceText(srcecode,srcetag,trgttag,trgtnode) {
	const eltid = $($("*:has(>metadata[semantictag*='"+trgttag+"'])",trgtnode)[0]).attr("id");
	const eltsrce  = getResourceText(srcecode,srcetag);
	$(UICom.structure.ui[eltid].resource.text_node[LANGCODE]).text(eltsrce);
	UICom.structure.ui[eltid].resource.save();
}

function getResourceText(portfoliocode,semtag) {
	let text = "";
	const url = serverBCK_API+"/nodes?portfoliocode=" + portfoliocode + "&semtag="+semtag;
	$.ajax({
		async : false,
		type : "GET",
		dataType : "xml",
		url : url,
		success : function(data) {
			text = $("text[lang='"+LANG+"']",$("asmResource[xsi_type!='context'][xsi_type!='nodeRes']",data)).text();
		},
		error : function(data) {
		}
	});
	return text;
}

//========================================================================

function setMatriculeEtudiant(nodeid) {
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

function setCourrielEtudiant(nodeid) {
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

///========================================================================

function setItemElts(nodeid,srcetag,trgttag) {
	const srceid = $($("*:has(>metadata[semantictag*='"+srcetag+"'])",g_portfolio_current)[0]).attr("id");
	const trgtid = $($("*:has(>metadata[semantictag*='"+trgttag+"'])",UICom.structure.ui[nodeid].node)[0]).attr("id");
	if (srceid!=undefined && trgtid!=undefined) {
		$(UICom.structure.ui[trgtid].resource.code_node).text(UICom.structure.ui[srceid].resource.getCode());
		$(UICom.structure.ui[trgtid].resource.value_node).text(UICom.structure.ui[srceid].resource.getValue());
		$(UICom.structure.ui[trgtid].resource.label_node[LANGCODE]).text(UICom.structure.ui[srceid].resource.getLabel(null,'none'));
		UICom.structure.ui[trgtid].resource.save();
	}
}

//---------------------------------------

function getPortfolioCodeSubstring(type,str){
	let result = "";
	if (type=='formation') {
		result = str.substring(str.indexOf("/")+1);
		result = result.substring(0,result.indexOf("/"));
	} else if (type=='login-etu-12') {
		result = str.substring(str.lastIndexOf("portfolio-")+10);
	} else if (type=='login-etudiant') {
		result = str.substring(str.lastIndexOf("portfolio-etudiant-")+19);
	} else if (type=='login-etu') {
		result = str.substring(str.lastIndexOf("-etu-")+5);
	} else if (type=='cohorte') {
		result = str.substring(str.lastIndexOf("/")+1);
		result = result.substring(0,result.indexOf("."));
	} 
	return result;
}

function getPortfolioCodeFormation(str){
	return getPortfolioCodeSubstring('formation',str);
}

//=============================================================
//================= ENVOI NOTIFICATION ========================
//=============================================================

function sendNotification(subject,body,email) {
	var message = "";
	message = body;
	message = message.replace("##firstname##",USER.firstname);
	message = message.replace("##lastname##",USER.lastname);
	var elt = document.createElement("p");
	elt.textContent = message;
	message = elt.innerHTML;
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

//==================================
function envoiCourriel(message,email) 
//==================================
{
	message = message.replace("##firstname##",USER.firstname);
	message = message.replace("##lastname##",USER.lastname);
	const urlhtml = g_configVar['send-email-url']==""?g_configVar['send-email-image']:g_configVar['send-email-url']
	message = message.replace("##click-here##","<a href='"+url+"' style='"+g_configVar['send-email-url-style']+"'>"+urlhtml+"</a>");
	var elt = document.createElement("p");
	elt.textContent = message;
	message = elt.innerHTML;
	message = message.replace(/..\/..\/..\/..\/..\/../g, window.location.protocol+"//"+window.location.host);
	//------------------------------
	var xml ="<node>";
	xml +="<sender>"+$(USER.email_node).text()+"</sender>";
	xml +="<recipient>"+email+"</recipient>";
	xml +="<subject>"+USER.firstname+" "+USER.lastname+" a publié du contenu sur Karuta.</subject>";
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

//==================================================================
//====================== FEDDBACK QUESTION==========================
//==================================================================

function buildSaveFeedbackQuestion(nodeid,pageid,type,sendemail,role) {
	const actionlabel = UICom.structure.ui[pageid].getLabel(null,'none');
	let actioncode = UICom.structure.ui[pageid].getCode();
	if (actioncode.indexOf('*')>-1)
		actioncode = actioncode.substring(0,actioncode.indexOf('*'))
	const selects = $("asmContext:has(metadata[semantictag*='"+role+"-select'])",$(UICom.structure.ui[pageid].node));
	const etudiant = getItemUserInfos(pageid,'etudiant-select');
	//--------------------------
	const question = $("text[lang='"+LANG+"']",$("asmContext:has(metadata[semantictag='question'])",UICom.structure.ui[nodeid].node)).text();
	const reponse = $("text[lang='"+LANG+"']",$("asmContext:has(metadata[semantictag='reponse'])",UICom.structure.ui[nodeid].node)).text();
	const question1 = question.replace(/(<br("[^"]*"|[^\/">])*)>/g, "$1/>");
	const question2 = question1.replace(/(<img("[^"]*"|[^\/">])*)>/g, "$1/>");
	const reponse1 = reponse.replace(/(<br("[^"]*"|[^\/">])*)>/g, "$1/>");
	const reponse2 = reponse1.replace(/(<img("[^"]*"|[^\/">])*)>/g, "$1/>");
	//--------------------------
	const feedback_metadata = $("metadata",UICom.structure.ui[nodeid].node);
	const date_dem_eval = $(feedback_metadata).attr("date-demande");
	const previewURL = getPreviewSharedURL(pageid,role);
	const a5 = JSON.stringify(new KAPCfeedback(previewURL,date_dem_eval,"",actioncode,actionlabel,etudiant.matricule,question2,reponse2,"",etudiant.email));
	//---------------------------
	const selfcode = $("code",$("asmRoot>asmResource[xsi_type='nodeRes']",g_portfolio_current)).text();
	const formation = getPortfolioCodeSubstring("formation",selfcode);
	const cohorte = getPortfolioCodeSubstring("cohorte",selfcode);
	//---------------------------
	let candelete = "";
	for (let i=0;i<selects.length;i++){
		const selectid = $("code",selects[i]).text();
		candelete += (i==0) ? selectid:","+selectid;
		}
	for (let i=0;i<selects.length;i++){
		const selectid = $("code",selects[i]).text();
		const selectemail = $("value",selects[i]).text();
		saveVector(selectid,type,nodeid,pageid,a5,etudiant.name,formation,cohorte,"","",candelete);
		//----envoi courriel à l'enseigant -----
		if (g_variables['sendemail']=='true') {
			const object = "Demande étudiante";
			const body = " ##firstname## ##lastname## vous a fait une demande de feedback pour son eportfolio. Accédez à votre environnement "+window.location.toString();
			sendNotification(object,body,selectemail);
		}
	}
	//-------------------
	const questionid = $("asmContext:has(metadata[semantictag='question'])",UICom.structure.ui[nodeid].node).attr("id");
	submit(questionid);
}

function buildSubmitFeebackQuestion(nodeid,pageid,type,role,object,body) {
	const actionlabel = UICom.structure.ui[pageid].getLabel(null,'none');
	let actioncode = UICom.structure.ui[pageid].getCode();
	if (actioncode.indexOf('*')>-1)
		actioncode = actioncode.substring(0,actioncode.indexOf('*'));
	const etudiant = getItemUserInfos(pageid,'etudiant-select');
	const date_dem_eval = $(UICom.structure.ui[nodeid].node).attr("date-demande");
	//--------------------------
	const question = $("text[lang='"+LANG+"']",$("asmContext:has(metadata[semantictag='question'])",UICom.structure.ui[nodeid].node)).text();
	const reponse = $("text[lang='"+LANG+"']",$("asmContext:has(metadata[semantictag='reponse'])",UICom.structure.ui[nodeid].node)).text();
	const question1 = question.replace(/(<br("[^"]*"|[^\/">])*)>/g, "$1/>");
	const question2 = question1.replace(/(<img("[^"]*"|[^\/">])*)>/g, "$1/>");
	const reponse1 = reponse.replace(/(<br("[^"]*"|[^\/">])*)>/g, "$1/>");
	const reponse2 = reponse1.replace(/(<img("[^"]*"|[^\/">])*)>/g, "$1/>");
	//--------------------------
	const date_evaluation = new Date().getTime();
	const previewURL = getPreviewSharedURL(pageid,role);
	const matricule = $("text[lang='"+LANG+"']",$("asmContext:has(metadata[semantictag='etudiant-matricule'])",UICom.structure.ui[pageid].node)).text();
	const a5 = JSON.stringify(new KAPCfeedback(previewURL,date_dem_eval,date_evaluation,actioncode,actionlabel,etudiant.matricule,question2,reponse2,""));
	//---------------------------
	const selfcode = $("code",$("asmRoot>asmResource[xsi_type='nodeRes']",g_portfolio_current)).text();
	const formation = getPortfolioCodeSubstring("formation",selfcode);
	const cohorte = getPortfolioCodeSubstring("cohorte",selfcode);
	//---------------------------
	deleteVector(null,null,nodeid)
	saveVector(USER.username,type,nodeid,pageid,a5,etudiant.name,formation,cohorte,"","");
	//----envoi courriel à l'étudiant -----
	if (g_variables['sendemail']=='true') {
		if (object==null)
			object = "Feedback répondu";
		if (body==null)
			body = actionlabel+": une réponse à votre question a été faite. . Accédez à votre environnement "+window.location.toString();
		sendNotification(object,body,etudiant.email);
	}
}


function demanderFeedbackQuestion(nodeid,role,object,body){
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
	buildSaveFeedbackQuestion(nodeid,pageid,type+"-feedback",null,role);
}

function soumettreFeedbackQuestion(nodeid,role){
	//---------------------------
	let parent = UICom.structure.ui[nodeid].node;
	while ($(parent).prop("nodeName")!="asmUnit") {
		parent = $(parent).parent();
	}
	const pageid = $("text[lang='"+LANG+"']",$("asmContext:has(>metadata[semantictag='page-uuid'])",parent)).text();
	//---------------------------
	const semtag = UICom.structure.ui[pageid].semantictag;
	const type = getType(semtag);
	buildSubmitFeebackQuestion(nodeid,pageid,type+"-feedback-done",role);
	submit(nodeid);
}

//=====================================================================

//==================================
function userExists(identifier) {
//==================================
	const url = serverBCK_API+"/users/user/username/"+identifier;
	let ok ="";
	$.ajax({
		async : false,
		type : "GET",
		contentType: "application/xml",
		dataType : "text",
		url : url,
		success : function(data) {
			userid = data;
			ok = true;
		},
		error : function(data) {
			ok = false;
		}
	});
	return ok;
}

//==================================
function portfolioExists(searchvalue) {
//==================================
	const url = serverBCK_API+"/portfolios?active=1&search="+searchvalue;
	let ok = "";
	$.ajax({
		async:false,
		type : "GET",
		dataType : "xml",
		url : url,
		success : function(data) {
			const items = $("portfolio",data);
			for ( let i = 0; i < items.length; i++) {
				const code = $("code",$("asmRoot>asmResource[xsi_type='nodeRes']",items[i])).text();
				ok = code.indexOf(searchvalue)>-1;
				if (ok)
					break;
			}
		}
	});
	return ok
}
//=====================================================================



//# sourceURL=kapc-commun.js
