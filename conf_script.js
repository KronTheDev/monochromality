const templates = ["Test", 
  "Template 1", 
  "Template 2"];


function copyClip (id) {
  navigator.clipboard.writeText(templates[id]);
  alert("Copied to clipboard!");
}