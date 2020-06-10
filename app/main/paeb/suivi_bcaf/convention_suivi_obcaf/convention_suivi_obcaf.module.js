(function ()
{
    'use strict';

    angular
        .module('app.paeb.suivi_bcaf.convention_suivi_obcaf', [])
        .config(config);
        var vs;
    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_suivi_bcaf_convention_suivi_obcaf', {
            url      : '/donnees-de-base/convention_suivi_obcaf',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/suivi_bcaf/convention_suivi_obcaf/convention_suivi_obcaf.html',
                    controller : 'Convention_suivi_obcafController as vm'
                }
            },
            bodyClass: 'convention_suivi_obcaf',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "convention_suivi_obcaf"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.suivi_bcaf.convention_suivi_obcaf', {
            title: 'Suivi convention (O-BCAF)',
            icon  : 'icon-keyboard-variant',
            state: 'app.paeb_suivi_bcaf_convention_suivi_obcaf',
			weight: 5,
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
                var permissions = ["OBCAF","ADMIN"];
                var x =  loginService.gestionMenu(permissions,permission);        
                vs = x ;

            });
        }
     
    }

})();
