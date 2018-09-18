let jsonForm_schema = {
    "schema": {
	"user": {
	    "type": "object",
	    "properties": {
		"id": { "type": "string" },
		"idSrc": { "type": "string", "enum": ["random", "coockie", "user"] },
		"background": { "type": "string" },
		"occupation": { "type": "string", "enum": ["Academic", "Industry", "Student"] },
	    },
	},
	"puzzleMode": { "type": "string" },
	"model": {
	    "type": "object",
	    "properties": {
		"freeText": { "type": "string" },
		"plantUML": { "type": "string" },
	    },
	},
	"verification": { "type": "string" },
    }
}

let jsonForm_form = {
    "form": [
	{ "type": "fieldset",
	  "title": "Identification",
	  "expandable": false,
	  "items": [
	      { "key": "user.id",
		"title": "Identifier"
	      },
	      { "key": "user.idSrc",
		"readonly": true
		// "type": "hidden" // JavaScript does not seems to work with this
	      },
	  ],
	},
	{ "type": "fieldset",
	  "title": "Context",
	  "expandable": false,
	  "items": [
	      { "key": "puzzleMode",
		"readonly": true
		// "type": "hidden" // JavaScript does not seems to work with this
	      },
	  ],
	},
	{ "type": "fieldset",
	  "title": "Meta-Modeling",
	  "expandable": false,
	  "items": [],
	},
	{ "type": "fieldset",
	  "title": "Modeling",
	  "expandable": false,
	  "items": [
	      { "type": "help",
		"notitle": true,
		"helpvalue": "Choose if you want to answer using free text or PlantUML."
	      },
	      { "type": "selectfieldset",
		"title": "Choose answer type:",
		// "description": "Choose if you want to answer using free text or PlantUML",
		"items": [
		    { "key": "model.plantUML",
		      "legend": "PlantUML",
		      "type": "textarea",
		      "title": "Model",
		      "description": "Model the example described above."
		    },
		    { "key": "model.freeText",
		      "legend": "Free text",
		      "type": "textarea",
		      "title": "Model",
		      "description": "Model the example described above."
		    },
		],
	      },
	  ],
	},
	{ "type": "fieldset",
	  "title": "Verification",
	  "expandable": false,
	  "items": [
	      { "type": "help",
		"notitle": true,
		"helpvalue": "How would you verify the property Prop ? Potentially provide OCL expressions."
	      },
	      { "key": "verification",
		"type": "textarea",
		"title": "Verification mechanism",
		"description": "Describe how the verification mechanism would work (a single OCL expression may be a sufficient answer)."
	      }
	  ],
	},
	{ "type": "fieldset",
	  "title": "Additional questions",
	  "expandable": true,
	  "items": [
	      { "key": "user.occupation",
		"title": "Position",
		"description": "Current occupation"
	      },
	      { "key": "user.background",
		"type": "textarea",
		"title": "Background",
		"description": "Education background: modeling/meta-modeling courses taken during “initial” studies, “professionnal” studies, self-taught, ...)"
	      },
	  ],
	},
	{
	    "type": "submit",
	    "title": "Submit"
	}
    ]
}

/// HELPER FUNCTIONS: COOCKIES
// Retrieved from https://www.w3schools.com/js/js_cookies.asp
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
////////////////////////////////////////////////////////////////////////////////

$('form').jsonForm(Object.assign(jsonForm_schema, jsonForm_form));

// Adding additional text
// Identification text
if ( $("legend:contains('Identification')").length ) {
    $("legend:contains('Identification')").after("\
        <p>In order to allow for multiple answers (and relate those), an identifier is randomly selected and stored in a cookie. You can modify this value if you wish. If cookies are disabled on your browser (or if you use different browsers), please always fill this field with the same value of your choice.</p>\
    ");
}
// Context text
if ( $("legend:contains('Context')").length ) {
    $("legend:contains('Context')").after("\
        <p>Let’s a company C be structured in a tree-shaped hierarchical way. For exemple, the world headquarter (HQ) overlooks the regional HQ, each one of them overlooking country HQ, each one of them overlooking ... This tree shaped hierarchical structure of HQ is of arbitrary width and depth, but not infinite or untractable (data size is not the problem of interest here).</p>\
        <p>Internal deliveries inside this company (that goes only from the top HQ to lower level HQ) is handled by recursive handling of nested packages. A package is addressed to a specific HQ. A package is composed of items and (sub-)packages. At reception of a package P, an HQ is supposed to : forward P to the addressee’s HQ if it is not the addressee itself ; or, if it is the addressee, then open the package, keep the items, and iterate on the sub-packages (forward packages adressed to other HQ, and open sub-packages adressed to itself). It is common for a package to contain sub-packages adressed to the same HQ.</p>\
        <p id='last-context-paragraph'>Inside the top level HQ, a unit A is in charge of packaging while a unit B is in charge of overlooking the delivery process. For every top-level package created, unit A sends a document to unit B that describes the structure and destinations of the package. The document does not contain any information about items (they are not the concern of the information exchange). The document describes the tree-shape structure of the package and its sub-packages, and it identifies the destination (an HQ) of every (sub-)package.</p>\
    ");
}
// Modeling text
const modelingSct = $("legend:contains('Modeling')").filter("legend:not(:contains('Meta'))");
if ( modelingSct.length ) {
    modelingSct.after("\
        <p>Provide the associated model for:\
          <ul>\
            <li>a company composed a top-level HQ (HQ1) and single sub-HQ (HQ2) (overall, there are only 2 HQ: HQ1 which overlooks HQ2);</li>\
            <li>a top-level package P1 composed of a 2 subpackages (P11 and P12);</li>\
            <li>P1 and P11 are addresses to HQ1, and P12 is addressed to HQ2.</li>\
          </ul>\
        </p>\
    "); }
// Verification text
var puzzleMode=getCookie("puzzleMode");
if (puzzleMode == "") {
    if ( Math.random() < 0.5 ) {
	puzzleMode = "before";
    } else {
	puzzleMode = "after";
    }
	
}
setCookie("puzzleMode", puzzleMode, 30);
$("input[name='puzzleMode']")[0].value = puzzleMode;
const verificationIntro = "\
    <p>Unit B wants to automatically verify a property (Prop) stating that every sub-package (SP) of a package (P) is addressed to the same HQ as its parent package or a sub-HQ of its parent package (P) destination. Meaning that SP is addressed to a HQ (HQsp) that is the same as P’s destination (HQp) or that is below HQp in the hierarchical structure.</p>\
    <p>Respecting Prop is not an obligation for unit A. But if a package does not respect it, this choice should be verified and discussed between units A and B.</p>\
";
if ( puzzleMode == "before" ) {
    const lastContextPar = $("p#last-context-paragraph");
    if ( lastContextPar.length ) { lastContextPar.after(verificationIntro); }
} else {
    const verificationSct = $("legend:contains('Verification')");
    if ( verificationSct.length ) { verificationSct.after(verificationIntro); }
}

// Setting up identification values
// id handling logic
var idValue=getCookie("formUserId");
$("select[name='user.idSrc']")[0].value = "coockie";
if (idValue == "") {
    idValue = (Math.random() + 1).toString(36).substring(2, 15);
    // var uuid = require("uuid"); idValue = uuid.v4();
    $("select[name='user.idSrc']")[0].value = "random";
}
setCookie("formUserId", idValue, 30);
$("input[name='user.id']")[0].value = idValue;
$("input[name='user.id']")[0].addEventListener(
    "change",
    function() {
	$("select[name='user.idSrc']")[0].value = "user";
	var userId = $("input[name='user.id']")[0].value
	setCookie("formUserId", userId, 30);
    },
    false)
