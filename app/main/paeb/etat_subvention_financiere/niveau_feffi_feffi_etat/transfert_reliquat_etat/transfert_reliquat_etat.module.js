(function ()
{
    'use strict';

    angular
        .module('app.paeb.etat_subvention_financiere.niveau_feffi_feffi_etat.transfert_reliquat_etat', [])
        .config(config);
        var vs ;
    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_etat_subvention_financiere_niveau_feffi_feffi_etat_transfert_reliquat_etat', {
            url      : '/donnees-de-base/etat_subvention_financiere/niveau_feffi_feffi_etat/transfert_reliquat_etat',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/etat_subvention_financiere/niveau_feffi_feffi_etat/transfert_reliquat_etat/transfert_reliquat_etat.html',
                    controller : 'Transfert_reliquat_etatController as vm'
                }
            },
            bodyClass: 'transfert_reliquat_etat',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "transfert_reliquat_etat"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.etat_subvention_financiere.niveau_feffi_feffi_etat.transfert_reliquat_etat', {
            title: 'Transfert reliquat',
            icon  : 'icon-link',
            state: 'app.paeb_etat_subvention_financiere_niveau_feffi_feffi_etat_transfert_reliquat_etat',
            weight: 1
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
