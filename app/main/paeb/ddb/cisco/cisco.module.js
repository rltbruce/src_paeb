(function ()
{
    'use strict';

    angular
        .module('app.paeb.ddb.cisco', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_ddb_cisco', {
            url      : '/donnees-de-base/cisco',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/ddb/cisco/cisco.html',
                    controller : 'CiscoController as vm'
                }
            },
            bodyClass: 'cisco',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Cisco"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.administration.donneesdebases.cisco', {
            title: 'Cisco',
            icon  : 'icon-tile-four',
            state: 'app.paeb_ddb_cisco'
        });
    }

})();
