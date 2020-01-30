(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_subvention_financiere.demande_deblocage_feffi', [])
        .run(testPermission)
        .config(config);
        var vs ;
    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_gerer_subvention_financiere_demande_deblocage_feffi', {
            url      : '/donnees-de-base/gerer_subvention_financiere/demande_deblocage_feffi',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/gerer_subvention_financiere/demande_deblocage_feffi/demande_deblocage_feffi.html',
                    controller : 'Demande_deblocage_feffiController as vm'
                }
            },
            bodyClass: 'demande_deblocage_feffi',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "demande_deblocage_feffi"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.gerer_subvention_financiere.demande_deblocage_feffi', {
            title: 'Saisi Demande feffi',
            icon  : 'icon-tile-four',
            state: 'app.paeb_gerer_subvention_financiere_demande_deblocage_feffi',
            weight: 1,
            hidden: function()
            {
                    return vs;
            }
        });
    }

    function testPermission(loginService,$cookieStore,apiFactory)
    {
        var id_user = $cookieStore.get('id');
       
        var permission = [];
        if (id_user > 0) 
        {
            apiFactory.getOne("utilisateurs/index", id_user).then(function(result) 
            {
                var user = result.data.response;
               

                var permission = user.roles;
                var permissions = ["OBCAF","BCAF"];
                var x =  loginService.gestionMenu(permissions,permission);        
                vs = x ;

            });
        }
     
    }

})();
