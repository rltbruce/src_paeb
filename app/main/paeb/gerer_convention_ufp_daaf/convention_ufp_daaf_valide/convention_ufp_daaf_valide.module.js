(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_convention_ufp_daaf.convention_ufp_daaf_valide', [])        
        .run(testPermission)       
        .config(config);
        var vs ;
    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_gerer_convention_ufp_daaf_convention_ufp_daaf_valide', {
            url      : '/donnees-de-base/convention_ufp_daaf_valide',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/gerer_convention_ufp_daaf/convention_ufp_daaf_valide/convention_ufp_daaf_valide.html',
                    controller : 'Convention_ufp_daaf_valideController as vm'
                }
            },
            bodyClass: 'convention_ufp_daaf_valide',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Convention_ufp_daaf_valide"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.gerer_convention_ufp_daaf.convention_ufp_daaf_valide', {
            title: 'Valide convention ',
            icon  : 'icon-tile-four',
            state: 'app.paeb_gerer_convention_ufp_daaf_convention_ufp_daaf_valide',
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
                        var permissions = ["DAAF"];
                        var x =  loginService.gestionMenu(permissions,permission);        
                        vs = x ;

                    });
                }
             
            }

})();
