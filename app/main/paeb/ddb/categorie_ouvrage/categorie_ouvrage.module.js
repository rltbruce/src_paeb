(function ()
{
    'use strict';

    angular
        .module('app.paeb.ddb.categorie_ouvrage', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_ddb_categorie_ouvrage', {
            url      : '/donnees-de-base/categorie_ouvrage',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/ddb/categorie_ouvrage/categorie_ouvrage.html',
                    controller : 'Categorie_ouvrageController as vm'
                }
            },
            bodyClass: 'categorie_ouvrage',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Categorie_ouvrage"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.ddb.categorie_ouvrage', {
            title: 'Categorie ouvrage',
            icon  : 'icon-clipboard-text',
            state: 'app.paeb_ddb_categorie_ouvrage',
			weight: 5
        });
    }

})();
