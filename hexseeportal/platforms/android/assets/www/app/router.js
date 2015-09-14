HexseePortalApp.config(function ($routeProvider, $locationProvider, hammerDefaultOptsProvider) {
	$routeProvider.
	when('/', {
		templateUrl: 'app/views/login.html',
		controller: 'LoginController'
	}).
	when('/journal/:adventureId', {
		templateUrl: 'app/views/journal.html',
		controller: 'JournalController'
	}).
	when('/journal', {
		templateUrl: 'app/views/journal.html',
		controller: 'JournalController'
	})

	hammerDefaultOptsProvider.set({
		recognizers: [[Hammer.Tap, {
			time: 0
        }]]
	});

	// use the HTML5 History API
	//$locationProvider.html5Mode(true);
});