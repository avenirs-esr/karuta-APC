//==============================
function export_w_tags(nodetag,portfoliocode)
//==============================
{
	const pageid = $("#page").attr('uuid');
	const nodeUUID = $("uuid",$("asmContext:has(metadata[semantictag='"+nodetag+"'])",UICom.structure.ui[pageid].node)).text();
	exportNode(nodeUUID,portfoliocode);
}

$("head").append("<style>.import-export .form-horizontal .form-group:nth-child(n+2) {display:none}</style>")

//# sourceURL=import-export.js