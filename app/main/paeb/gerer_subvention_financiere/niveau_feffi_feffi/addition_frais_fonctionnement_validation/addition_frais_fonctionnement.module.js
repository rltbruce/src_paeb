(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_subvention_financiere.niveau_feffi_feffi.addition_frais_fonctionnement_validation', [])
        .run(testPermission)
        //.run(insertiondemande_ufp_daaf_syst)
        .config(config);
        var vs ;
    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_gerer_subvention_financiere_niveau_feffi_feffi_addition_frais_fonctionnement_validation', {
            url      : '/donnees-de-base/gerer_subvention_financiere/niveau_feffi_feffi/addition_frais_fonctionnement_validation',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/gerer_subvention_financiere/niveau_feffi_feffi/addition_frais_fonctionnement_validation/addition_frais_fonctionnement_validation.html',
                    controller : 'Addition_frais_fonctionnement_validationController as vm'
                }
            },
            bodyClass: 'addition_frais_fonctionnement_validation',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "addition_frais_fonctionnement_validation"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.gerer_subvention_financiere.niveau_feffi_feffi.addition_frais_fonctionnement_validation', {
            title: 'Validation addition frais fonctionnement',
            icon  : 'icon-link',
            state: 'app.paeb_gerer_subvention_financiere_niveau_feffi_feffi_addition_frais_fonctionnement_validation',
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
