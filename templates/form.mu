<!DOCTYPE html> 

<html> 
  <head> 
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/> 
    <title>{{pres_title}}</title>
    <link type="text/css" href="/stylesheets/screen.css" media="screen" rel="stylesheet" />
    <link type="text/css" href="/stylesheets/admin.css" media="screen" rel="stylesheet" />
    <script type="text/javascript" src="/javascripts/jquery-1.4.2.min.js"></script>
    <script type="text/javascript" src="/javascripts/jquery.tabs.js"></script>
    <script type="text/javascript" src="/javascripts/jquery.previewable_comment_form.js"></script>
    <script type="text/javascript" src="/javascripts/admin.js"></script>
  </head> 
 
  <body> 
    <div id="main"> 
      <div class="site"> 
        <div id="guides"> 
          <div class="write"> 
  <h1>{{pres_title}}</h1> 
 
  <form class="edit_wiki" method="post" action="{{url}}"> 
    <div>
    {{#edit_pres}}
      <label> 
        Author<br /> 
        <input class="text" type="text" name="author" value="{{pres_author}}" /> 
      </label> 
      <br /> 
      <label> 
        Title<br /> 
        <input class="text" type="text" name="title" value="{{pres_title}}" /> 
      </label> 
      <br /> 
    {{/edit_pres}}

      <div id="wiki-form" class="comment-form wiki-form"> 
        <ul class="tabs inline-tabs"> 
          <li><a href="#write_bucket" action="write">Write</a></li> 
          <li><a href="#preview_bucket" action="preview">Preview</a></li> 
        </ul> 
        <div id="write_bucket" class="tab-content"> 
          <div class="inner"> 
            <textarea name="body">{{body}}</textarea> 
          </div> 
        </div> 
        <div id="preview_bucket" class="tab-content content-body content wikistyle gollum"> 
          <p>Loading content...</p> 
        </div> 
      </div> 

      <div class="actions"> 
        <input type="hidden" name="number" value="{{number}}"></input>
        <input type="submit" value="Save" /> 
      </div> 
    </div> 
  </form> 
</div> 
        </div> 
      </div> 
    </div> 
  </body> 
</html> 