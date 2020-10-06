(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_subvention_operation.niveau_feffi_prestataire.suivi_dpfi.convention_suivi_odpfi', [])
        .run(testPermission)
        .config(config);
    var vs ;
    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_gerer_subvention_operation_niveau_feffi_prestataire_suivi_dpfi_convention_suivi_odpfi', {
            url      : '/donnees-de-base/convention_suivi_odpfi',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/gerer_subvention_operation/niveau_feffi_prestataire/suivi_dpfi/convention_suivi_odpfi/convention_suivi_odpfi.html',
                    controller : 'Convention_suivi_odpfiController as vm'
                }
            },
            bodyClass: 'convention_suivi_odpfi',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "convention_suivi_odpfi"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.gerer_subvention_operation.niveau_feffi_prestataire.suivi_dpfi.convention_suivi_odpfi', {
            title: 'Insertion activité technique (O-DPFI)',
            icon  : 'icon-rotate-3d',
            state: 'app.paeb_gerer_subvention_operation_niveau_feffi_prestataire_suivi_dpfi_convention_suivi_odpfi',
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
                var permissions = ["ODPFI","ADMIN"];
                var x =  loginService.gestionMenu(permissions,permission);        
                vs = x ;

            });
        }
     
    }

})();
