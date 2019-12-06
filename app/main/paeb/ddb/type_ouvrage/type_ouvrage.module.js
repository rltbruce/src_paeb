(function ()
{
    'use strict';

    angular
        .module('app.paeb.ddb.type_ouvrage', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_ddb_type_ouvrage', {
            url      : '/donnees-de-base/type_ouvrage',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/ddb/type_ouvrage/type_ouvrage.html',
                    controller : 'Type_ouvrageController as vm'
                }
            },
            bodyClass: 'type_ouvrage',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Type_ouvrage"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.ddb.type_ouvrage', {
            title: 'Type_ouvrage',
            icon  : 'icon-clipboard-text',
            state: 'app.paeb_ddb_type_ouvrage',
			weight: 5
        });
    }

})();
