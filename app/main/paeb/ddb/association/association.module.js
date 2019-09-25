(function ()
{
    'use strict';

    angular
        .module('app.paeb.ddb.association', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_ddb_association', {
            url      : '/donnees-de-base/association',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/ddb/association/association.html',
                    controller : 'AssociationController as vm'
                }
            },
            bodyClass: 'association',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Association"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.ddb.association', {
            title: 'Association',
            icon  : 'icon-blur-radial',
            state: 'app.paeb_ddb_association',
			weight: 3
        });
    }

})();
