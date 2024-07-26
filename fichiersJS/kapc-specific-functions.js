
//==================================================================
//================= SPECIFIC FUNCTIONS =============================
//==================================================================

function specificEnterDisplayPortfolio()
{
	if ($("body",document).attr('userrole')=='etudiant') {
		const fc = $("*:has(>metadata[semantictag*=fichier-consentement])",g_portfolio_current).not(":has(>metadata-wad[submitted=Y])");
		if (fc.length!=0) {
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
}


function specificDisplayPortfolios(type){
	if (USER.other=="enseignant" || USER.other=="cons-interne" || USER.other=="tuteur" || USER.other=="responsable") {
		if (type==null)
			type = 'card';
		let nb_visibleportfolios = 0;
		let visibleportfolios = [];
		let no_visibleportfolio = 0;
		for (var i=0;i<portfolios_list.length;i++){
			//--------------------------
			if (portfolios_list[i].visible && $(portfolios_list[i].code_node).text().indexOf('portfolio-pp')<0 && $(portfolios_list[i].code_node).text().indexOf('alternance-')<0 && $(portfolios_list[i].code_node).text().indexOf('portfolio-etu')<0 && $(portfolios_list[i].code_node).text().indexOf('portfolio-pp-etu')<0) {
				visibleportfolios.push(portfolios_list[i].node);
				no_visibleportfolio = i;
				nb_visibleportfolios++;
			}
		}
		//---------------------------------------------------------------------------------------------
		if (nb_visibleportfolios>1)
				UIFactory.PortfolioFolder.displayPortfolios('card-deck-portfolios','false',type,visibleportfolios);
		else if (nb_visibleportfolios==1){
			display_main_page(portfolios_list[no_visibleportfolio].id);
		}
	} else if (USER.other!="etudiant")
		throw 'non etudiant';
	else {
		let autoload = "";
		let nb_visibleportfolios = 0;
		for (var i=0;i<portfolios_list.length;i++){
			//--------------------------
			if (portfolios_list[i].visible || portfolios_list[i].ownerid==USER.id) {
				nb_visibleportfolios++;
			}
			if (portfolios_list[i].autoload && $(portfolios_list[i].code_node).text().indexOf(USER.username)>-1) { // Pour éviter les portfolios partagsé comme pair
				autoload = portfolios_list[i].id;
			}
		}
		// -- if there is no autoload portfolio, we search if any has the role set in USER.other ---
		if (autoload=="") {
			var visible = [];
			for (var i=0;i<portfolios_list.length;i++){
				$.ajax({
					async:false,
					type : "GET",
					dataType : "xml",
					url : serverBCK_API+"/rolerightsgroups/all/users?portfolio="+portfolios_list[i].id,
					success : function(data) {
						if ($("rrg:has('user[id="+USER.id+"]'):has('label:contains(etudia)')",data).length>0)
							visible[visible.length] = i; //portfolios_list[i].id;
					}
				});
			}
			if (visible.lenght==1)
				autoload = portfolios_list[visible[0]].id;
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

//# sourceURL=karuta-specific-functions.js