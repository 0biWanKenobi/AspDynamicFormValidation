<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Index.aspx.cs" Inherits="WebSite.Index" %>
<%@ Import Namespace="System.Web.Optimization" %>
<%@ Register src="~/jsLiveBuilder.ascx" tagName="LiveBuilder" tagPrefix="js" %>
<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Home page</title>
    <asp:PlaceHolder runat="server">   
        <%: Scripts.Render("~/bundle/js")%>
        <%: Styles.Render("~/bundle/css")%>
        <%: Styles.Render("~/Styles/Kendo/css")%>
    
    </asp:PlaceHolder>
    <js:LiveBuilder runat="server"/>
</head>
<body>
    <form id="myform">
        <label for="field1">field1</label>  
        <input class="myform-input" type="text" id="field1" name="field1" placeholder="enter some text" />
        <label for="field2">field2</label>    
        <input class="myform-input" type="text" id="field2" name="field2" placeholder="enter some text" />
        <label for="field3">field3</label>    
        <input class="myform-input" type="text" id="field3" name="field3" placeholder="enter some text" />
        <label for="field4">field4</label>    
        <input class="myform-input" type="text" id="field4" name="field4" value='something' placeholder="enter some text" />
        <label for="field5">field5</label>
        <input class="myform-input" type="text" id="field5" name="field5" placeholder="enter some text" />
        
        <button id='register' class="k-button">Register</button>
    </form>
<asp:HyperLink id="hyperlink1" 
               NavigateUrl="ValidatorConfiguration.aspx"
               Text="Configure Form Validation Rules"
               runat="server"/>
</body>
</html>
