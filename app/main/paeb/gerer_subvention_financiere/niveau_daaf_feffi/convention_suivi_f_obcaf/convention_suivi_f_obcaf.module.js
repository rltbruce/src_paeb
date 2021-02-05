(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_subvention_financiere.niveau_daaf_feffi.convention_suivi_f_obcaf', [])
        .run(testPermission)
        .config(config);
        var vs ;
    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_gerer_subvention_financiere_niveau_daaf_feffi_convention_suivi_f_obcaf', {
            url      : '/donnees-de-base/gerer_subvention_financiere/niveau_daaf_feffi/convention_suivi_f_obcaf',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/gerer_subvention_financiere/niveau_daaf_feffi/convention_suivi_f_obcaf/convention_suivi_f_obcaf.html',
                    controller : 'Convention_suivi_f_obcafController as vm'
                }
            },
            bodyClass: 'convention_suivi_f_obcaf',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "convention_suivi_f_obcaf"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.gerer_subvention_financiere.niveau_daaf_feffi.convention_suivi_f_obcaf', {
            title: 'Insertion activité financière',
            icon  : 'icon-keyboard-variant',
            state: 'app.paeb_gerer_subvention_financiere_niveau_daaf_feffi_convention_suivi_f_obcaf',
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
                var permissions = ["AAC","ADMIN"];
                var x =  loginService.gestionMenu(permissions,permission);        
                vs = x ;

            });
        }
     
    }

})();
