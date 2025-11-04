const templates = ["Test", 
  `DELETE THIS PART
    Replace all of the objects between brackets with your own Suggestion content, but do not touch any other part (especially parentheses).

    # *[Suggestion Name] (Level Suggestion)*

    ## Pitch:
    ***[Short Paragraph of 4-5 lines describing the general feel and purpose of the Level]***

    ## Notice:
    - **[Argument 1]**
    - **[Argument 2]**
    - **[Argument 3]**
    - **... up to 5 arguments to make your Suggestion attractive.**

    ## Description:
    *[Describe your Level as in-depth as possible]*

    ## Attachments

    **[Preferably Images; Rarely any other Files.]**`,
"Template 2"];


function copyClip (id) {
  navigator.clipboard.writeText(templates[id]);
  alert("Copied to clipboard!");
}