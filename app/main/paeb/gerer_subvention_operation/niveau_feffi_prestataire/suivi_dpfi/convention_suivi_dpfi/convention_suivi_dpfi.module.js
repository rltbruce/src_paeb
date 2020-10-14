(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_subvention_operation.niveau_feffi_prestataire.suivi_dpfi.convention_suivi_dpfi', [])
       .run(testPermission)
        .config(config);
    var vs ;
    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_gerer_subvention_operation_niveau_feffi_prestataire_suivi_dpfi_convention_suivi_dpfi', {
            url      : '/donnees-de-base/convention_suivi_dpfi',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/gerer_subvention_operation/niveau_feffi_prestataire/suivi_dpfi/convention_suivi_dpfi/convention_suivi_dpfi.html',
                    controller : 'Convention_suivi_dpfiController as vm'
                }
            },
            bodyClass: 'convention_suivi_dpfi',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "convention_suivi_dpfi"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.gerer_subvention_operation.niveau_feffi_prestataire.suivi_dpfi.convention_suivi_dpfi', {
            title: 'Validation activité technique (DPFI)',
            icon  : 'icon-rotate-3d',
            state: 'app.paeb_gerer_subvention_operation_niveau_feffi_prestataire_suivi_dpfi_convention_suivi_dpfi',
            weight: 2,
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
                var permissions = ["DPFI","ADMIN"];
                var x =  loginService.gestionMenu(permissions,permission);        
                vs = x ;

            });
        }
     
    }

})();
