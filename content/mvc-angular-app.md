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

###Prepare some folders for our angular stuff.. exciting!
- Add a new folder to the solution at **~/Scripts/app** . 
- We'll set up a few subfolders too:
 -	**~/Scripts/app/controllers**
 -	**~/Scripts/app/directives**
 -	**~/Scripts/app/views**

###Configure our bundles
We'll set these up now so we can embed our JavaScript and CSS in our page.

- Navigate to **~/App_Start/BundleConfig.cs**
- Remove the jqueryui bundle, and add our own for bootstrap and angular

```cs
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
		.Include("~/Scripts/angular.js", "~/Scripts/angular-resource.js"));

	bundles.Add(new ScriptBundle("~/bundles/angular-app")
		.IncludeDirectory("~/Scripts/app", "*.js", true));
}
```

###Clean up our Index view. 
We're not going to render anything server side, so open up **~/Views/Home/Index.cshtml** and remove everything!

###Let's start with a fresh slate for our CSS too...
Open up **~/Content/Site.css** and remove EVERYTHING!  We're using bootstrap out tha' gate, so we'll add styles as we need them, not pre-emptively.

###Set up our layout to host our app
In **~/Views/Shared/_Layout.html**, let's modify the content to look like this:

```html
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
</html>
```

The important things to note are that we added the [ng-app](http://docs.angularjs.org/api/ng.directive:ngApp) attribute to the body and we added a div with the [ng-view](http://docs.angularjs.org/api/ng.directive:ngView) attribute. 

We don't have an app yet or a view… but we'll do that right aways!  

We've also updated the page to include our new bundles so that the JavaScript and CSS we create will get delivered properly..  if you build and run the project now (F5), you should see a blank page with a simple header reading "Angular App". 

Hold on there. Sit back down, we're not done yet.

If we open Web Inspector, we can see that we have a single error; Angular is complaining that we don't yet have a module called 'myApp'

###We need a module!
Let's get started creating our angular app so that ng-app attribute actually has something to grab onto.

A module is Angular's way of separating different concerns. Each file of our app can define its own module or can rely on the default module by accessing the myApp variable by name.

Create a javascript file, called **app.js** in the **~/Scripts/app** folder and let's create our first module by adding the following code:

```javascript
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

```

What we're doing is handling routes on the client side. Since Single Page Apps don't reload the page, the URL doesn't appreciably change; instead, we use URL fragments to track logical pages. This means we define checkpoints throughout our app which are bookmarkable and navigable using the back button. In this case, we're doing the simplest possible thing: using only one endpoint (and associated controller), which is attached to the root "`/`" URL.

###NEXT!!
We've defined our module, our app, and we've defined some routes. Remember the ng-view we defined in the template? This configuration will determine what content gets placed there depending on the route URL in the browser. But, we haven't created our view template or controller yet!

Create an html file at **~/Scripts/app/views/home.html** and replace the default content with the following:

 ```html
 <div class="span12">    
    {{title}}
</div>
```

Create a JavaScript file at **~/Scripts/app/controllers/home.js** and add the following content:

```javascript
'use strict';
angular.module('myApp.controller', []).controller('HomeCtrl', function($scope) {
	$scope.title = “Hello worrrrllld”;    
});
```

We also have to get our app module set up. In the root module (app.js), change the module definition to include 'myApp.controller' as a dependency:

```javascript
var myApp = angular.module('myApp', ['myApp.controller']);
```

###It's ALIVE!!
Now, if you rebuild your app and run it, you should see the page rendered with the text from our home view. Interesting? Mind blown? I hope not yet. That would be embarrassing.

###Make it pop!
Let's see if we can do something more interesting and make it talk to the server.

Go to the default Web API controller created for us at **~/Controllers/ValuesController.cs**. It's a silly name, but let's work with it for now. Let's modify the **Get()** method a bit…


```cs
public IEnumerable<dynamic> Get()
{
	return new dynamic[] { 
		new {name="Tiger", sound="Rawrrr"}, 
		new {name="Dog", sound="Ruff"}, 
		new {name="Cat", sound="Meowzers"}, 
		new {name="Duck", sound="quack"},  
		new {name="Horse", sound="Prrbrbrbbrbr"},
		new {name="Rabbit", sound="..."},
		new {name="Pig", sound="SQUEEEEEEEE"}
	};
}
```

Let's also add some code to our angular controller at **home.js**:

```javascript
angular.module('myApp.controller', ['ngResource']).controller('HomeCtrl', function ($scope, $resource) {

    var Animal = $resource('/api/Values/:type');
    var values = Animal.query(function (animals) {
        $scope.animals = animals;
    });
});
```

And let's see if we can display that in our view too. Adjust the template in your **home.html** file:
```html
<div class="span12">
    {{title}}

    <ul>
        <li ng-repeat="animal in animals">
            <span>{{animal.name}}</span>
        </li>
    </ul>
</div>
```

If you build + run the app again, it'll. --  OH SNAP!

We now have an angular js app that displays a simple home view, retrieves some values from the server, and displays them in a list.

OK. Simple so far, but we're on our way. We've built some functional plumbing that we can extend.

###Make 'em Squeal!
You know what would be cool? What if the animal sounds were displayed when we hovered over the animal names..  but we don't want to use a lame HTML title.
Hmm, problem. HTML doesn't have a built-in noise bubble.

[Directives](http://docs.angularjs.org/guide/directive) to the rescue? Let's wire one up so that we can add functionality to our template declaratively.  To do the actual rendering, we can integrate bootstrap's tooltip.

Ok. Create another javascript file at **~/Scripts/app/directives/noisebubble.js** and add the following:

```javascript
'use strict';
myApp.directive('noiseBubble', function () {
    return {
        link: function (scope, elm, attrs) {
            elm.tooltip({
                title: scope.$eval(attrs.noise)
            });
        }
    };
});
```

Now that we have a sweet, sweet directive, let's update our home template:

```html
<div class="span12">
  {{title}}
    <ul>
        <li ng-repeat="animal in animals">
            <span noise-bubble noise="animal.sound">{{animal.name}}</span>
        </li>
    </ul>
</div>
```
OH! THAT IS BEAUTIFUL. WHUT! 

Kinda cool. Oh, but hey! I can't add any animals. What if I want to add my own animal that goes "HREEEEK!"

###I can do that.

Let's go ahead and adjust our controller so that we have an object to use for creating new stuff. Let's add the following code to the end of our controller:

```javascript
$scope.newAnimal = {}
$scope.saveNewAnimal = function () {
    $scope.animals.push($scope.newAnimal);
    $scope.newAnimal = {};
};
```

Let's adjust our home template and create a simple form for adding animals. It should now look like this:

```html
<div class="span12">
    {{title}}
    <ul>
        <li ng-repeat="animal in animals">
            <span noise-bubble noise="animal.sound">{{animal.name}}</span>
        </li>
    </ul>
    <form ng-submit="saveNewAnimal()">
        <h5>Add a new animal</h5>
        <label>Name:</label>
        <input ng-model="newAnimal.name" />
        <label>Sound:</label>
        <input ng-model="newAnimal.sound" />
        <input type="submit" value="Add" />
    </form>
</div>

```
