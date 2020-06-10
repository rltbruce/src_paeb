(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_subvention_financiere.niveau_daaf_feffi.suivi_f_daaf.convention_suivi_f_odaaf', [])
        .run(testPermission)
        .config(config);
        var vs ;
    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_gerer_subvention_financiere_niveau_daaf_feffi_suivi_f_daaf_convention_suivi_f_odaaf', {
            url      : '/donnees-de-base/gerer_subvention_financiere/niveau_daaf_feffi/suivi_f_daaf/convention_suivi_f_odaaf',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/gerer_subvention_financiere/niveau_daaf_feffi/suivi_f_daaf/convention_suivi_f_odaaf/convention_suivi_f_odaaf.html',
                    controller : 'Convention_suivi_f_odaafController as vm'
                }
            },
            bodyClass: 'convention_suivi_f_odaaf',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "convention_suivi_f_odaaf"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.gerer_subvention_financiere.niveau_daaf_feffi.suivi_f_daaf.convention_suivi_f_odaaf', {
            title: 'Suivi convention (O-DAAF)',
            icon  : 'icon-rotate-3d',
            state: 'app.paeb_gerer_subvention_financiere_niveau_daaf_feffi_suivi_f_daaf_convention_suivi_f_odaaf',
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
                var permissions = ["daaf","ADMIN"];
                var x =  loginService.gestionMenu(permissions,permission);        
                vs = x ;

            });
        }
     
    }

})();
