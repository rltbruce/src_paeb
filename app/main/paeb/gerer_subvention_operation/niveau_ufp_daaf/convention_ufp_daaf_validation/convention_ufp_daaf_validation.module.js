(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_subvention_operation.niveau_ufp_daaf.convention_ufp_daaf_validation', [])
        .run(testPermission)
        .config(config);
var vs;
    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_gerer_subvention_operation_niveau_ufp_daaf_convention_ufp_daaf_validation', {
            url      : '/donnees-de-base/convention_ufp_daaf_validation',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/gerer_subvention_operation/niveau_ufp_daaf/convention_ufp_daaf_validation/convention_ufp_daaf_validation.html',
                    controller : 'Convention_ufp_daaf_validationController as vm'
                }
            },
            bodyClass: 'convention_ufp_daaf_validation',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "convention_ufp_daaf_validation"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.gerer_subvention_operation.niveau_ufp_daaf.convention_ufp_daaf_validation', {
            title: 'Validation convention UFP/DAAF',
            icon  : 'icon-source-pull',
            state: 'app.paeb_gerer_subvention_operation_niveau_ufp_daaf_convention_ufp_daaf_validation',
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
