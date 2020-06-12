(function ()
{
    'use strict';

    angular
        .module('app.paeb.accueil', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.population_accueil', {
            url      : '/accueil',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/accueil/accueil.html',
                    controller : 'AccueilController as vm'
                }
            },
            bodyClass: 'accueil',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Acceuil"
            }
        });

        // Translation
        $translatePartialLoaderProvider.addPart('app/main/paeb/accueil');

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.accueil', {
            title : 'Acceuil',
            icon  : 'icon-palette-advanced',
            state : 'app.population_accueil',
            translate: 'accueil.menu.titre',
            weight: 1,
            hidden: function ()
            {
              //var permissions = ["ALLp"];
              //var x =  loginService.isPermitted(permissions);
            }
        });
    }

})();
