(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_subvention_operation.niveau_ufp_daaf.site_validation', [])
        .run(testPermission)        
        .config(config);
var vs ;
    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_gerer_subvention_operation_niveau_ufp_daaf_site_validation', {
            url      : '/donnees-de-base/site_validation',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/gerer_subvention_operation/niveau_ufp_daaf/site_validation/site_validation.html',
                    controller : 'Site_validationController as vm'
                }
            },
            bodyClass: 'site_validation',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "site_validation"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.gerer_subvention_operation.niveau_ufp_daaf.site_validation', {
            title: 'Validation site',
            icon  : 'icon-nfc-variant',
            state: 'app.paeb_gerer_subvention_operation_niveau_ufp_daaf_site_validation',
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
                var permissions = ["DAAF","ADMIN"];
                var x =  loginService.gestionMenu(permissions,permission);        
                vs = x ;

            });
        }
     
    }

})();
