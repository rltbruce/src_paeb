(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_moe.prestation_moe.police_assurance', [])
        .run(testPermission)
        .config(config);
        var vs ;

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_gerer_situation_moe_prestation_moe_police_assurance', {
            url      : '/donnees-de-base/police_assurance',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/gerer_situation_moe/prestation_moe/police_assurance/police_assurance.html',
                    controller : 'Police_assuranceController as vm'
                }
            },
            bodyClass: 'police_assurance',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "police_assurance"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.gerer_situation_moe.prestation_moe.police_assurance', {
            title: 'Police assurance',
            icon  : 'icon-blur-radial',
            state: 'app.paeb_gerer_situation_moe_prestation_moe_police_assurance',
			weight: 3,
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
                var permissions = ["OBCAF"];
                var x =  loginService.gestionMenu(permissions,permission);        
                vs = x ;

            });
        }
     
    }

})();
