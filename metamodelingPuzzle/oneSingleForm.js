let jsonForm_schema = {
  "schema": {
    "user": {
      "type": "object",
      "properties": {
        "id": { "type": "string" },
        "idSrc": { "type": "string", "enum": ["random", "coockie", "URL", "user"] },
        "background": { "type": "string" },
        "occupation": { "type": "string", "enum": ["Academic", "Industry", "Student"] },
      },
    },
    "puzzleMode": { "type": "string" },
    "metamodel": {
      "type": "object",
      "properties": {
	"freeText": { "type": "string" },
	"diagrams": {
	  "type": "array",
	  "items": { "type": "string" }
	},
      },
    },
    "model": {
      "type": "object",
      "properties": {
        "freeText": { "type": "string" },
        "plantUML": { "type": "string" },
      },
    },
    "verification": { "type": "string" },
    "feedback": { "type": "string" },
      "timing": {
	  "type": "object",
	  "properties": {
	      "form": {
		  "type": "object",
		  "properties": {
		      "start": { "type": "string" },
		      "end": { "type": "string" },
		  },
	      },
	  },
    },
  }
}

let jsonForm_form = {
  "form": [
      { "key": "timing.form.start",
        "readonly": true,
        "type": "hidden"
      },
      { "key": "timing.form.end",
        "readonly": true,
        "type": "hidden"
      },
    { "type": "fieldset",
      "title": "Identification",
      "expandable": true,
      "htmlClass": "expanded",
      "items": [
        { "key": "user.id",
          //"title": "Respondent identifier:",
	  "notitle": true, "prepend": "Respondent identifier: ",
        },
        { "key": "user.idSrc",
          "readonly": true,
          "type": "hidden"
        },
      ],
    },
    { "type": "fieldset",
      "title": "Context",
      "expandable": true,
      "htmlClass": "expanded",
      "items": [
        { "key": "puzzleMode",
          "readonly": true,
	  "type": "hidden"
        },
      ],
    },
    { "type": "fieldset",
      "title": "Meta-Modeling",
      "expandable": true,
      "htmlClass": "expanded",
      "items": [
        { "type": "help",
          "notitle": true,
          "helpvalue": "You can answer using the free text area and multiple <a href='http://plantuml.com'>PlantUML</a> diagrams."
        },
        { "key": "metamodel.freeText",
          "legend": "Free text",
          "type": "textarea",
          "title": "Free text area",
	},
	{ "type": "tabarray",
	  "items": [ {
	      "type": "section",
	      "legend": "Diag. {{idx}}",
	      "items": [
		  { "key": "metamodel.diagrams[]",
		    "type": "textarea",
                    "title": `
                      <span class="help-block">(Unfocus from the textarea to regenerate the diagram)<br/>(Click on te [+] button below to add a diagram)</span>
                      <a href='http://plantuml.com'>PlantUML</a> description of the diagram<br/>
                      `,
		    "value": `
note "This is an example" as N1
class Class1
class "Another class" as c2
Class1 <|-- "1..*" c2
"Yet another" *-- Class4
c2 "1" --> "0..1" Class4
N1 .. Class1`,
		    "append": `
                      <span>
                        <!-- <label>Generated diagram</label> -->
                        <div class="center">
                          <img id="metamodel.diagrams[{{idx}}-1].diag" class="center metamodel-diagram"/>
                        </div>
                      </span>
                      `,
		    onChange: function (evt) {
			var code = $(evt.target).val();
			var imgDOM = $(evt.target).next("span").find("img.metamodel-diagram");
			generatePlantUML(code, imgDOM);
		    }
		  } ]
	  } ]
	},
      ],
    },
    { "type": "fieldset",
      "title": "Modeling",
      "expandable": true,
      "htmlClass": "expanded",
      "items": [
        { "type": "help",
          "notitle": true,
          "helpvalue": "Choose if you want to answer using free text or <a href='http://plantuml.com'>PlantUML</a>."
        },
        { "type": "selectfieldset",
          "title": "Choose answer type: &nbsp;&nbsp;",
	  // "prepend": "Choose answer type:",
          // "description": "Choose if you want to answer using free text or PlantUML",
          "items": [
            { "key": "model.plantUML",
              "legend": "PlantUML",
              "type": "textarea",
              "title": `
                <a href='http://plantuml.com'>PlantUML</a> description of the model<br/>
                <span class="help-block">(Unfocus to regenerate the diagram)</span>`,
	      // "description": "Unfocus to regenerate the diagram",
	      "value": `
note "This is an example" as N1
object "An object" as o1
object "Another object" as o2
object "Yet another" as o3
o1 *-- "1..*" o2
o2 "1" --> "0..1" o3
N1 .. o1`,
	      "append": `
                    <span>
                      <!-- <label>Generated diagram</label> -->
                      <div class="center">
                        <img id="model.plantUML.diag" class="center"/>
                      </div>
                    </span>
                  `,
	      onChange: function (evt) {
		  var code = $(evt.target).val();
		  generatePlantUML(code, $("img[id='model.plantUML.diag']"));
	      }
	    },
            { "key": "model.freeText",
              "legend": "Free text",
              "type": "textarea",
              "title": "Free text description of the model",
              // "description": "Model the example described above."
	    },
          ],
        },
      ],
    },
    { "type": "fieldset",
      "title": "Verification",
      "expandable": true,
      "htmlClass": "expanded",
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
      "htmlClass": "expanded",
      "items": [
        { "key": "user.occupation",
          // "title": "Position",
	  "notitle": true, "prepend": "Position: ",
          "description": "Current occupation",
	  "fieldHtmlClass": "inline", // Does not work. Can't access the controls div
        },
        { "key": "user.background",
          "type": "textarea",
          "title": "Meta-modeling/modeling Background",
          "description": "Education background: modeling/meta-modeling courses taken during “initial” studies, “professionnal” studies, self-taught, ...)"
        },
      ],
    },
    { "type": "fieldset",
      "title": "Comment on the questionnaire",
      "expandable": true,
      // "htmlClass": "expanded",
      "items": [
        { "type": "help",
          "notitle": true,
          "helpvalue": "If you have any feedback to provide to improve the questionnaire, please provide it in the following box."
        },
        { "key": "feedback",
          "type": "textarea",
          "title": "Feedback",
          // "description": ""
        }
      ],
    },
    { "type": "submit",
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

// Correcting generated display
$("fieldset.expanded > div").css({ display: "block" });
$("select.nav").parent().addClass("inline");
$("select.nav").parent().prev().addClass("inline");
//$("select[name='user.occupation']").parent().addClass("inline");
//$("select[name='user.occupation']").parent().prev().addClass("inline");

// Adding additional text
// Identification text
const identificationSct = $("legend:contains('Identification')").next("div");
if ( identificationSct.length ) {
  identificationSct.prepend(`
    <p>In order to allow for multiple answers (and relate those), an identifier is randomly selected and stored in a cookie. You can modify this value if you wish. If cookies are disabled on your browser (or if you use different browsers), please always fill this field with the same value of your choice.</p>
  `);
}
// Context text
const contextStc = $("legend:contains('Context')").next("div");
if ( contextStc.length ) {
  contextStc.prepend(`
    <p>Let’s a company C be structured in a tree-shaped hierarchical way. For exemple, the world headquarter (HQ) overlooks the regional HQ, each one of them overlooking country HQ, each one of them overlooking ... This tree shaped hierarchical structure of HQ is of arbitrary width and depth, but not infinite or untractable (data size is not the problem of interest here).</p>
    <p>Internal deliveries inside this company (that goes only from the top HQ to lower level HQ) is handled by recursive handling of nested packages. A package is addressed to a specific HQ. A package is composed of items and (sub-)packages. At reception of a package P, an HQ is supposed to : forward P to the addressee’s HQ if it is not the addressee itself ; or, if it is the addressee, then open the package, keep the items, and iterate on the sub-packages (forward packages adressed to other HQ, and open sub-packages adressed to itself). It is common for a package to contain sub-packages adressed to the same HQ.</p>
    <p id='last-context-paragraph'>Inside the top level HQ, a unit A is in charge of packaging while a unit B is in charge of overlooking the delivery process. For every top-level package created, unit A sends a document to unit B that describes the structure and destinations of the package. The document does not contain any information about items (they are not the concern of the information exchange). The document describes the tree-shape structure of the package and its sub-packages, and it identifies the destination (an HQ) of every (sub-)package.</p>
  `);
}
// Meta-modeling text
const metamodelingSct = $("legend:contains('Meta-Modeling')").next("div");
if ( metamodelingSct.length ) {
  metamodelingSct.prepend(`
    <p>We want to replace this document-based transfer of information between units A and B, by a model-based transfer of information (instead of A sending a textual document to B, A sends a model to B) that would be compatible for any company having a similar tree-shaped structure and using similar delivery system of nested packages.</p>
    <p>How would you design the support of this model-based transfer of information (meta-model or something else + any additional elements/information needed to use it) ?</p>
  `);
}
// Adding diagram for model.plantUML
const metamodelPlantumlTA = $("textarea[name='metamodel.diagrams[0]']");
if ( metamodelPlantumlTA.length ) {
    var code = metamodelPlantumlTA[0].value;
    generatePlantUML(code, $("img.metamodel-diagram:eq(0)"));
}
// Modeling text
const modelingSct = $("legend:contains('Modeling')").filter("legend:not(:contains('Meta'))").next("div");
if ( modelingSct.length ) {
  modelingSct.prepend(`
    <p>Provide the associated model for:
      <ul>
      <li>a company composed a top-level HQ (HQ1) and single sub-HQ (HQ2) (overall, there are only 2 HQ: HQ1 which overlooks HQ2);</li>
      <li>a top-level package P1 composed of a 2 subpackages (P11 and P12);</li>
      <li>P1 and P11 are addresses to HQ1, and P12 is addressed to HQ2.</li>
      </ul>
    </p>
  `); }
// Adding diagram for model.plantUML
const modelPlantumlTA = $("textarea[name='model.plantUML']");
if ( modelPlantumlTA.length ) {
	// Added as an append field in the form
  // modelPlantumlTA.after(`
  //   <span>
  //     <label>Generated diagram</label>
  //     <div class="center">
  //       <img id="model.plantUML.diag" class="center"/>
  //     </div>
  //   </span>
  // `);
    var code = modelPlantumlTA[0].value;
    generatePlantUML(code, $("img[id='model.plantUML.diag']"));
}
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
  const verificationSct = $("legend:contains('Verification')").next("div");
  if ( verificationSct.length ) { verificationSct.prepend(verificationIntro); }
}

// Setting up timing.start value
$("input[name='timing.form.start']")[0].value = Math.floor(Date.now() / 1000);
$("form[name='quiz']")[0].addEventListener(
  "submit",
  function() {
      $("input[name='timing.form.end']")[0].value = Math.floor(Date.now() / 1000);
  },
    false);

// Setting up identification values
// id handling logic

var idValue=getCookie("formUserId");
$("input[name='user.idSrc']")[0].value = "coockie";
// window.alert("Coockie returned: "+idValue);
if (idValue == "" || idValue == "undefined") {
  // Not in coockie, trying to retrieve it from the URL
    var queryDict = {};
    location.search.substr(1).split("&").forEach(
	function(item) {queryDict[item.split("=")[0]] = item.split("=")[1]}
    );
    idValue = queryDict['user.id'];
    // window.alert("URL returned: "+idValue);
    $("input[name='user.idSrc']")[0].value = "URL";
    if (idValue == "" || idValue == "undefined") {
	// Not in coockie or URL, generating a new one
	// var uuid = require("uuid"); idValue = uuid.v4();
	idValue = (Math.random() + 1).toString(36).substring(2, 15);
	$("input[name='user.idSrc']")[0].value = "random";
    }
}
setCookie("formUserId", idValue, 30);
$("input[name='user.id']")[0].value = idValue;
$("input[name='user.id']")[0].addEventListener(
  "change",
  function() {
    $("input[name='user.idSrc']")[0].value = "user";
    var userId = $("input[name='user.id']")[0].value
    setCookie("formUserId", userId, 30);
  },
  false)

//
function generatePlantUML(code, imgDOM) {
    var encodedSrc = encode64(deflate(unescape(encodeURIComponent(code))));
    if (encodedSrc != 'AyrBIKtBp4jD0G00') {
        // alert(code + "\n" + encodedSrc);
        imgDOM.attr('src',"http://www.plantuml.com/plantuml/png/"+encodedSrc);
    }
}


// eval: (setq-default indent-tabs-mode nil)
// eval: (setq tab-width 2)
// eval: (setq-local javascript-indent-level 2)
// eval: (setq js-indent-level 2)
// eval: (setq js2-basic-offset 2)
