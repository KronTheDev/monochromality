const templates = ["Template 1", 
  "Template 2", 
  "Template 3"];


function copyClip (id) {
  navigator.clipboard.writeText(templates[id]);
  alert("Copied to clipboard!");
}