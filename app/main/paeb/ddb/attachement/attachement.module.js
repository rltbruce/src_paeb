(function ()
{
    'use strict';

    angular
        .module('app.paeb.ddb.attachement', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_ddb_attachement', {
            url      : '/donnees-de-base/attachement',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/ddb/attachement/attachement.html',
                    controller : 'AttachementController as vm'
                }
            },
            bodyClass: 'attachement',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Attachement"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.ddb.attachement', {
            title: 'Attachement',
            icon  : 'icon-clipboard-text',
            state: 'app.paeb_ddb_attachement',
			weight: 5
        });
    }

})();
