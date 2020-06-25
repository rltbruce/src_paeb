(function ()
{
    'use strict';

    angular
        .module('app.paeb.etat_subvention_operation.niveau_ufp_daaf_etat.convention_ufp_daaf_etat', [])
        .config(config);
var vs;
    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_etat_subvention_operation_niveau_ufp_daaf_etat_convention_ufp_daaf_etat', {
            url      : '/donnees-de-base/convention_ufp_daaf_etat',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/etat_subvention_operation/niveau_ufp_daaf_etat/convention_ufp_daaf_etat/convention_ufp_daaf_etat.html',
                    controller : 'Convention_ufp_daaf_etatController as vm'
                }
            },
            bodyClass: 'convention_ufp_daaf_etat',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "convention_ufp_daaf_etat"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.etat_subvention_operation.niveau_ufp_daaf_etat.convention_ufp_daaf_etat', {
            title: 'Validation convention',
            icon  : 'icon-source-pull',
            state: 'app.paeb_etat_subvention_operation_niveau_ufp_daaf_etat_convention_ufp_daaf_etat',
            weight: 4,
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
                var permissions = ["DAAF","ADMIN"];
                var x =  loginService.gestionMenu(permissions,permission);        
                vs = x ;

            });
        }
     
    }

})();
