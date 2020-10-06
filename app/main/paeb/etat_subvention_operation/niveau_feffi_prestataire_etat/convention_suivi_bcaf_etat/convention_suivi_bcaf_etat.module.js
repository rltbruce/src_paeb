(function ()
{
    'use strict';

    angular
        .module('app.paeb.etat_subvention_operation.niveau_feffi_prestataire_etat.convention_suivi_bcaf_etat', [])
        .config(config);
    var vs ;
    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_etat_subvention_operation_niveau_feffi_prestataire_etat_convention_suivi_bcaf_etat', {
            url      : '/donnees-de-base/convention_suivi_bcaf_etat',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/etat_subvention_operation/niveau_feffi_prestataire_etat/convention_suivi_bcaf_etat/convention_suivi_bcaf_etat.html',
                    controller : 'Convention_suivi_bcaf_etatController as vm'
                }
            },
            bodyClass: 'convention_suivi_bcaf_etat',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "convention_suivi_bcaf_etat"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.etat_subvention_operation.niveau_feffi_prestataire_etat.convention_suivi_bcaf_etat', {
            title: 'Etat activité technique',
            icon  : 'icon-rotate-3d',
            state: 'app.paeb_etat_subvention_operation_niveau_feffi_prestataire_etat_convention_suivi_bcaf_etat',
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
                var permissions = ["BCAF","ADMIN"];
                var x =  loginService.gestionMenu(permissions,permission);        
                vs = x ;

            });
        }
     
    }

})();
