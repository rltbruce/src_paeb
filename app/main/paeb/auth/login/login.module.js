(function ()
{
    'use strict';

    angular
        .module('app.paeb.auth.login', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_auth_login', {
            url      : '/auth/login',
            views    : {
                'main@'                       : {
                    templateUrl: 'app/core/layouts/content-only.html',
                    controller : 'MainController as vm'
                },
                'content@app.paeb_auth_login': {
                    templateUrl: 'app/main/paeb/auth/login/login.html',
                    controller : 'LoginController as vm'
                }
            },
            bodyClass: 'login',
            data : {
              authorizer : false,
              permitted : ["USER"],
              page: "Authentification"
            }
        });

        // Translation
        $translatePartialLoaderProvider.addPart('app/main/paeb/auth/login');
    }

})();
