// === version 1.4.0 2022/05/25 ===

// ----------------- TESTS ----------------
	
function testConsInterneCodeNotEmpty(uuid) {
	if (uuid == null)
		uuid = $("#page").attr('uuid');
	const cons_internes = $("asmContext:has(metadata[semantictag='cons-interne-select'])",UICom.structure.ui[uuid].node);
	return (cons_internes.length>0);
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

//---------------------- VECTEURS --------------------------

function buildSaveFeedbackVectorPP(nodeid,pageid,type,sendemail,role) {
	const actionlabel = UICom.structure.ui[pageid].getLabel(null,'none');
	let actioncode = UICom.structure.ui[pageid].getCode();
	if (actioncode.indexOf('*')>-1)
		actioncode = actioncode.substring(0,actioncode.indexOf('*'))
	const selects = $("asmContext:has(metadata[semantictag*='"+role+"-select'])",$(UICom.structure.ui[pageid].node));
	const etudiant = $("text[lang='"+LANG+"']",$("asmContext:has(metadata[semantictag='prenom_nom'])",UICom.structure.ui[pageid].node)).text();
	const etudiant_email = $("text[lang='"+LANG+"']",$("asmContext:has(metadata[semantictag='etudiant-courriel'])",UICom.structure.ui[pageid].node)).text();
	const feedback_metadata = $("metadata",UICom.structure.ui[nodeid].node);
	//--------------------------
	const question = $("text[lang='"+LANG+"']",$("asmContext:has(metadata[semantictag='question'])",UICom.structure.ui[nodeid].node)).text();
	const reponse = $("text[lang='"+LANG+"']",$("asmContext:has(metadata[semantictag='reponse'])",UICom.structure.ui[nodeid].node)).text();
	const question1 = question.replace(/(<br("[^"]*"|[^\/">])*)>/g, "$1/>");
	const question2 = question1.replace(/(<img("[^"]*"|[^\/">])*)>/g, "$1/>");
	const reponse1 = reponse.replace(/(<br("[^"]*"|[^\/">])*)>/g, "$1/>");
	const reponse2 = reponse1.replace(/(<img("[^"]*"|[^\/">])*)>/g, "$1/>");
	//--------------------------
	const date_dem_eval = $(feedback_metadata).attr("date-demande");
	const previewURL = getPreviewSharedAPCURL(pageid,role);
	const matricule = $("text[lang='"+LANG+"']",$("asmContext:has(metadata[semantictag='etudiant-matricule'])",UICom.structure.ui[pageid].node)).text();
	const formation = "?";
	const cohorte = "?";
	const a5 = JSON.stringify(new KAPCfeedback(previewURL,date_dem_eval,"",actioncode,actionlabel,matricule,question2,reponse2,"",etudiant_email)).replaceAll("&nbsp;"," ");
	let candelete = "";
	for (let i=0;i<selects.length;i++){
		const selectid = $("code",selects[i]).text();
		candelete += (i==0) ? selectid:","+selectid;
		}
	for (let i=0;i<selects.length;i++){
		const selectid = $("code",selects[i]).text();
		const selectemail = $("value",selects[i]).text();
		saveVector(selectid,type,nodeid,pageid,a5,etudiant,formation,cohorte,"","",candelete);
		//----envoi courriel à l'enseigant -----
		if (g_variables['sendemail']=='true') {
			const object = "Demande étudiante";
			const body = " ##firstname## ##lastname## vous a fait une demande de feedback pour son eportfolio. Accédez à votre environnement "+window.location.toString();
			sendNotification(object,body,selectemail);
		}
	}
	//-------------------
}

function buildSubmitFeebackVectorPP(nodeid,pageid,type,role) {
	const actionlabel = UICom.structure.ui[pageid].getLabel(null,'none');
	let actioncode = UICom.structure.ui[pageid].getCode();
	if (actioncode.indexOf('*')>-1)
		actioncode = actioncode.substring(0,actioncode.indexOf('*'));
	
	const etudiant = $("text[lang='"+LANG+"']",$("asmContext:has(metadata[semantictag='prenom_nom'])",UICom.structure.ui[pageid].node)).text();
//	const etudiant = $("label[lang='"+LANG+"']",$("asmContext:has(metadata[semantictag='prenom_nom'])",UICom.structure.ui[pageid].node)).text().replaceAll("&nbsp;"," ");
	const etudiant_email = $("value",$("asmContext:has(metadata[semantictag='prenom_nom'])",UICom.structure.ui[pageid].node)).text();
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
	const previewURL = getPreviewSharedAPCURL(pageid,role);
	const matricule = $("text[lang='"+LANG+"']",$("asmContext:has(metadata[semantictag='etudiant-matricule'])",UICom.structure.ui[pageid].node)).text();
	const formation = "?";
	const cohorte = "?";
	const a5 = JSON.stringify(new KAPCfeedback(previewURL,date_dem_eval,date_evaluation,actioncode,actionlabel,matricule,question2,reponse2,"")).replaceAll("&nbsp;"," ");
	deleteVector(null,null,nodeid)
	saveVector(USER.username,type,nodeid,pageid,a5,etudiant,formation,cohorte,"","");
	//----envoi courriel à l'étudiant -----
	if (g_variables['sendemail']=='true') {
		const object = "Feedback répondu";
		const body = actionlabel+": une réponse à votre question a été faite. . Accédez à votre environnement "+window.location.toString();
		sendNotification(object,body,etudiant_email);
	}
	//-------------------
	const reponseid = $("asmContext:has(metadata[semantictag='reponse'])",UICom.structure.ui[nodeid].node).attr("id");
	submit(reponseid);
}

function demanderFeedbackPP(nodeid,role){
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
	buildSaveFeedbackVectorPP(nodeid,pageid,type+"-feedback",null,role);
	const questionid = $("asmContext:has(metadata[semantictag='question'])",UICom.structure.ui[nodeid].node).attr("id");
	submit(questionid);
}

function modifierFeedbackPP(nodeid,role){
	//---------------------------
	const feedbacknode = $(UICom.structure.ui[nodeid].node).parent();
	const feedbacknodeid = $(feedbacknode).attr('id');
	let parent = UICom.structure.ui[nodeid].node;
	while ($(parent).prop("nodeName")!="asmUnit") {
		parent = $(parent).parent();
	}
	const pageid = $(parent).attr('id');
	//---------------------------
	const semtag = UICom.structure.ui[pageid].semantictag;
	const type = getType(semtag);
	deleteVector(null,type+'-feedback',feedbacknodeid);
	buildSaveFeedbackVectorPP(feedbacknodeid,pageid,type+"-feedback",null,role);
	UIFactory.Node.reloadUnit();
}

function soumettreFeedbackPP(nodeid,role){
	//---------------------------
	let parent = UICom.structure.ui[nodeid].node;
	while ($(parent).prop("nodeName")!="asmUnit") {
		parent = $(parent).parent();
	}
	const pageid = $(parent).attr('id');
	//---------------------------
	const semtag = UICom.structure.ui[pageid].semantictag;
	const type = getType(semtag);
	buildSubmitFeebackVectorPP(nodeid,pageid,type+"-feedback-done",role);
	submit(nodeid);
}

// -----------------PARTAGES-----------------

//==================================
function getSendSharingURLPP(nodeid,uuid,sharewithrole,sharetoemail,sharetoroles,langcode,sharelevel,shareduration,sharerole,shareoptions)
//==================================
{
	var emailsarray = [];
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	var sharetomessage = "";
	var sharetoobj = "";
	$("#edit-window-footer").html("");
	fillEditBoxBody();
	$("#edit-window-title").html(karutaStr[LANG]['share-URL']);
	var js1 = "javascript:$('#edit-window').modal('hide')";
	var send_button = "<button id='send_button' class='btn'>"+karutaStr[LANG]['button-send']+"</button>";
	var obj = $(send_button);
	$(obj).click(function (){
		if (sharetoemail.indexOf('?')>-1) {
			sharetoemail = $("#email").val();
		}
		if (shareoptions.indexOf('mess')>-1) {
			sharetomessage = $("#message").val();
			sharetomessage = $('<div/>').text(sharetomessage).html();  // encode html
		}
		if (shareoptions.indexOf('obj')>-1) {
			sharetoobj = $("#object").val();
		}
		if (shareduration=='?') {
			shareduration = $("#duration").val();
		}
		if (sharetoemail!='' && shareduration!='' && USER.email!=null && sharetoemail!=USER.email) {
			getPublicURLPP(uuid,sharetoemail,sharerole,sharewithrole,sharelevel,shareduration,langcode,sharetomessage,sharetoobj);
			if (shareoptions.indexOf('function:')>-1) {
				var functionelts = shareoptions.substring(9).split('/');
				var functionstring = functionelts[0] + "(";
				for (var i=1; i<functionelts.length; i++) {
					functionstring += functionelts[i];
					if (i<functionelts.length-1)
						functionstring += ",";
				}
				functionstring += ")";
				eval (functionstring);
			}
		} else if (sharetoemail==USER.email){
			let html = karutaStr[LANG]["noemail-yourself"];
			$("#edit-window-body").html(html);
		}
	});
	$("#edit-window-footer").append(obj);
	var footer = " <button class='btn' onclick=\""+js1+";\">"+karutaStr[LANG]['Close']+"</button>";
	$("#edit-window-footer").append($(footer));
	var html = "<div style='display:none'>" + g_configVar['send-email-logo'] +"</div>";
	html += "<div class='form-horizontal'>";
	html += "<div class='form-group'>";
	if (sharetoemail=='?') {
		html += "		<label for='email' class='col-sm-3 control-label'>"+karutaStr[LANG]['email']+"</label>";
		html += "		<div class='col-sm-9'>";
		html += "			<input autocomplete='off' id='email' type='text' class='form-control'>";
		html += "		</div>";
	}
	if (shareoptions.indexOf('obj')>-1) {
		html += "		<label for='object' class='col-sm-3 control-label'>"+karutaStr[LANG]['subject']+"</label>";
		html += "		<div class='col-sm-9'>";
		html += "			<input id='object' type='text' class='form-control'>";
		html += "		</div>";
	}
	if (shareoptions.indexOf('mess')>-1) {
		html += "		<label for='message' class='col-sm-3 control-label'>"+karutaStr[LANG]['message']+"</label>";
		html += "		<div class='col-sm-9'>";
		html += "<textarea id='message' class='form-control' expand='false' style='height:300px'></textarea>";
		html += "		</div>";
	}
	if (shareduration=='?') {
		html += "		<label for='email' class='col-sm-3 control-label'>"+karutaStr[LANG]['shareduration']+"</label>";
		html += "		<div class='col-sm-9'>";
		html += "			<input id='duration' type='text' class='form-control'>";
		html += "		</div>";
	}
	html += "</div>";
	html += "</div>";
	$("#edit-window-body").html(html);
	$("#message").wysihtml5(
			{
				toolbar:{"size":"xs","font-styles": false,"html":true,"blockquote": false,"image": false,"link": false},
				"uuid":uuid,
				"locale":LANG
			}
		);
	if (shareoptions.indexOf('emailautocomplete')>-1) {
		for ( var i = 0; i < UsersActive_list.length; i++) {
			emailsarray[emailsarray.length] = {'libelle': UsersActive_list[i].email_node.text()};
		}
		addautocomplete(document.getElementById('email'), emailsarray);
	}
	//--------------------------
	$("#edit-window").modal('show');
}


//==================================
function getPublicURLPP(uuid,email,sharerole,role,level,duration,langcode) {
//==================================
	if (role==null)
		role = "all";
	if (level==null)
		level = 4; //public
	if (duration==null)
		duration = 'unlimited'; 
	var urlS = serverBCK+'/direct?type=email&uuid='+uuid+'&email='+email+'&role='+role+'&l='+level+'&d='+duration+'&sharerole='+sharerole;
	$.ajax({
		type : "POST",
		dataType : "text",
		contentType: "application/xml",
		url : urlS,
		success : function (data){
			sendEmailPublicURLPP(data,email,langcode);
		}
	});
}

//==================================
function sendEmailPublicURLPP(encodeddata,email,langcode) {
//==================================
	var url = window.location.href;
	var serverURL = url.substring(0,url.indexOf("/application/htm"));
	if (url.indexOf("/application/htm")<0)
		serverURL = url.substring(0,url.indexOf("/karuta/htm"));
	url = serverURL+"/karuta/htm/public.htm?i="+encodeddata+"&amp;lang="+languages[langcode];
	//------------------------------
	var message = "";
	message += "Bonjour,<br>";
	message += "##firstname## ##lastname## vous a posé une question sur son portfolio.<br>";
	message += "Pour accéder au portfolio ##click-here##.<br>";
	message += "En bas de la page cliquer sur l'onglet conseiller externe pour voir et répondre à la question.<br>";
	
	//------------------------------

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
	xml +="<subject>"+USER.firstname+" "+USER.lastname+" "+karutaStr[LANG]['want-sharing']+"</subject>";
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


//# sourceURL=projet-pro.js