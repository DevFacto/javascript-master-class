#Creating an angular js application with Visual Studio

###Creating the application

- Go to File -> New -> Project...
- Select  "ASP.NET MVC 4 Web Application"
- Give your application a name - I called mine "AngularApp"
- Click OK
- Select the Web API project template and the Razor view engine
- Click OK 

###Let's set up our dependencies
Right click on project and select "Manage Nuget Packages". Let's clean up and get rid of some of the stuff we don't want:

Go to the "Installed packages" section

- Uninstall knockoutjs 
- Uninstall jquery ui

Go to the "Online" section and:

- search for angular js and install it
- Search for bootstrap and install that too

Close the nuget package manager for now.

###Set some folders for our angular stuff.. exciting!
- Add a new at ~/Scripts/app . 
- We'll set up a few subfolders too:
 -	~/Scripts/app/controllers
 -	~/Scripts/app/directives
 -	~/Scripts/app/views

###Configure our bundles
- Navigate to ~/App_Start/BundleConfig.cs
- Remove the jqueryui bundle, and add our own for bootstrap and angular

````
public static void RegisterBundles(BundleCollection bundles)
{
    bundles.Add(new StyleBundle("~/Content/bootstrap")
    	.Include("~/Content/bootstrap.css", 
    	"~/Content/bootstrap-responsive.css"));
    
    bundles.Add(new StyleBundle("~/Content/css")
    	.Include("~/Content/Site.css"));

    bundles.Add(new ScriptBundle("~/bundles/jquery")
    	.Include("~/Scripts/jquery-{version}.js"));

    bundles.Add(new ScriptBundle("~/bundles/bootstrap")
    	.Include("~/Scripts/bootstrap.js"));

    bundles.Add(new ScriptBundle("~/bundles/angular")
    	.Include("~/Scripts/angular.js"));

    bundles.Add(new ScriptBundle("~/bundles/angular-app")
    	.IncludeDirectory("~/Scripts/app", "*.js", true));
}````


###Clean up our Index view. 
We're not going to render anything server side, so…

- Open up ~/Views/Home/Index.cshtml and remove everything!

###Let's start with a fresh slate for our CSS too...
- Open up ~/Content/Site.css and remove everything! 

###Set up our layout to host our app
- In ~/Views/Shared/_Layout.html, let's modify the content to look like this:

````
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <title>Angular App</title>
    <link href="~/favicon.ico" rel="shortcut icon" type="image/x-icon" />
    <meta name="viewport" content="width=device-width" />
    @Styles.Render("~/Content/bootstrap")
    @Styles.Render("~/Content/css")
</head>
    <body ng-app="myApp">
        <div class="navbar navbar-fixed-top">
            <div class="navbar-inner">
                <div class="brand">
                    Angular App
                </div>
            </div>
        </div>
        <div class="container" style="margin-top:50px;">
            <div class="row" ng-view>
                @RenderBody()
            </div>
        </div>
        @Scripts.Render("~/bundles/jquery")
        @Scripts.Render("~/bundles/bootstrap")
        @Scripts.Render("~/bundles/angular")
        @Scripts.Render("~/bundles/angular-app")
        @RenderSection("scripts", required: false)
    </body>
</html>````

The important things to note are that we added the ng-app attribute to the body and we added a div with the ng-view attribute. We don't have an app yet or a view… but we'll do that right aways!  We've also update to include our new bundles so that the javascript we create will get delivered properly..  if you build and run the project now (F5), you should see a blank page with a simple header reading "Angular App".

###We need a module!
Let's get started creating our angular app so that ng-app attribute actually has something to grab onto.
- Create a javascript file, called app.js in the ~/Scripts/app folder
- Let's create our first module by adding the following code to this file:

````
'use strict';

var myApp = angular.module('myApp', []);

myApp.config(['$routeProvider', function ($routeProvider) {
    //Set up routes
    $routeProvider
        .when('/', {
            templateUrl: '/Scripts/app/views/home.html',
            controller: 'HomeCtrl'
        })
        .otherwise({
           redirectTo: '/' 
        });
   } ]);

myApp.run(['$rootScope', function($rootScope) {

}]);````

###NEXT!!
Now, we've defined our module, our app, and we've defined some routes. We've said that for the default route, we want to render a home view. Remember the ng-view we defined in the template… this configuration will determine what content gets placed there depending on the route URL in the browser. But, we haven't created our view template or controller yet!

- Create an html file at ~/Scripts/app/views/home.html and replace the default content with the following:

 ````
 <div class="span12">    
    {{message}}
</div>
````

- Create a JavaScript file at ~/Scripts/app/controllers/home.js and add the following content:

````
'use strict';
myApp.controller('HomeCtrl', ['$scope', function($scope) {
	$scope.message = “Hello worrrrllld”;    
}]);
````

###It's ALIVE!!
Now, if you rebuild your app and run it, you should see the page rendered with the text from our home view. Interesting? Probably not yet.

###Make it pop!
Let's see if we can do something more interesting and get something from the server.

- Go to the default Web API controller created for us at ~/Controllers/ValuesController.cs. It's a silly name, but let’s work with it for now. Let's modify the Get() method a bit…

How many hello worlds would you like?

````
public IEnumerable<string> Get()
{
    return new string[] { 
        "Hello World 1", 
        "Hello World 2", 
        "Hello World 3", 
        "Hello World 4", 
        "Hello World 5"
    };
}
````

- Let's also add some code to our angular controller at home.js:

````
myApp.controller('HomeCtrl', ['$scope', function ($scope, $http) {
    $scope.message = "hello worrrllld";

    $http.get('/api/Values').success(function (data) {
        $scope.messages = data;
    });
}]);
````

- And let's see if we can display that in our view too. Adjust the template in your home.html file:
````
<div class="span12">
    {{message}}

    <ul>
        <li ng-repeat="message in messages">
            {{message}}
        </li>
    </ul>
</div>
````

Oh SNAP!