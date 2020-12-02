(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_subvention_financiere.niveau_ufp_feffi.suivi_f_bcaf_ufp.convention_suivi_f_bcaf_ufp', [])
        .run(testPermission)
        .config(config);
        var vs ;
    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_gerer_subvention_financiere_niveau_ufp_feffi_suivi_f_bcaf_ufp_convention_suivi_f_bcaf_ufp', {
            url      : '/donnees-de-base/gerer_subvention_financiere/niveau_ufp_feffi/suivi_f_bcaf_ufp/convention_suivi_f_bcaf_ufp',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/gerer_subvention_financiere/niveau_ufp_feffi/suivi_f_bcaf_ufp/convention_suivi_f_bcaf_ufp/convention_suivi_f_bcaf_ufp.html',
                    controller : 'Convention_suivi_f_bcaf_ufpController as vm'
                }
            },
            bodyClass: 'convention_suivi_f_bcaf_ufp',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "convention_suivi_f_bcaf_ufp"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.gerer_subvention_financiere.niveau_ufp_feffi.suivi_f_bcaf_ufp.convention_suivi_f_bcaf_ufp', {
            title: 'Validation activitée financière (BCAF)',
            icon  : 'icon-rotate-3d',
            state: 'app.paeb_gerer_subvention_financiere_niveau_ufp_feffi_suivi_f_bcaf_ufp_convention_suivi_f_bcaf_ufp',
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
                var permissions = ["DPFI","ADMIN"];
                var x =  loginService.gestionMenu(permissions,permission);        
                vs = x ;

            });
        }
     
    }

})();
