(function ()
{
    'use strict';

    angular
        .module('app.paeb.ddb.bureau_etude', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_ddb_bureau_etude', {
            url      : '/donnees-de-base/bureau_etude',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/ddb/bureau_etude/bureau_etude.html',
                    controller : 'Bureau_etudeController as vm'
                }
            },
            bodyClass: 'bureau_etude',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Bureau_etude"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.ddb.bureau_etude', {
            title: 'bureau_etude',
            icon  : 'icon-ticket-account',
            state: 'app.paeb_ddb_bureau_etude',
			weight: 6
        });
    }

})();