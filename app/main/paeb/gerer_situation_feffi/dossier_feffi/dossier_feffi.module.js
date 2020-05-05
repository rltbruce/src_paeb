(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_feffi.dossier_feffi', [])
        .run(testPermission)
        .config(config);
        var vs ;

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_gerer_situation_feffi_dossier_feffi', {
            url      : '/donnees-de-base/dossier_feffi',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/gerer_situation_feffi/dossier_feffi/dossier_feffi.html',
                    controller : 'Dossier_feffiController as vm'
                }
            },
            bodyClass: 'dossier_feffi',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "dossier_feffi"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.gerer_situation_feffi.dossier_feffi', {
            title: 'Dossier feffi',
            icon  : 'icon-tile-four',
            state: 'app.paeb_gerer_situation_feffi_dossier_feffi',
			weight: 3,
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
                var permissions = ["OBCAF","ADMIN"];
                var x =  loginService.gestionMenu(permissions,permission);        
                vs = x ;

            });
        }
     
    }

})();
