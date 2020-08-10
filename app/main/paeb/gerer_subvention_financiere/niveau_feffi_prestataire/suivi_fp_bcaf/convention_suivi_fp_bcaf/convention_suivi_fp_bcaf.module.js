(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_subvention_financiere.niveau_feffi_prestataire.suivi_fp_bcaf.convention_suivi_fp_bcaf', [])
        .run(testPermission)
        .config(config);
        var vs ;
    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_gerer_subvention_financiere_niveau_feffi_prestataire_suivi_fp_bcaf_convention_suivi_fp_bcaf', {
            url      : '/donnees-de-base/gerer_subvention_financiere/niveau_feffi_prestataire/suivi_fp_bcaf/convention_suivi_fp_bcaf',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/gerer_subvention_financiere/niveau_feffi_prestataire/suivi_fp_bcaf/convention_suivi_fp_bcaf/convention_suivi_fp_bcaf.html',
                    controller : 'Convention_suivi_fp_bcafController as vm'
                }
            },
            bodyClass: 'convention_suivi_fp_bcaf',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "convention_suivi_fp_bcaf"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.gerer_subvention_financiere.niveau_feffi_prestataire.suivi_fp_bcaf.convention_suivi_fp_bcaf', {
            title: 'Suivi convention (BCAF)',
            icon  : 'icon-rotate-3d',
            state: 'app.paeb_gerer_subvention_financiere_niveau_feffi_prestataire_suivi_fp_bcaf_convention_suivi_fp_bcaf',
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
                var permissions = ["OBCAF","ADMIN"];
                var x =  loginService.gestionMenu(permissions,permission);        
                vs = x ;

            });
        }
     
    }

})();