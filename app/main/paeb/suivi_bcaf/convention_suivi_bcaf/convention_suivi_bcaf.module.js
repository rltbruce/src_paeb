(function ()
{
    'use strict';

    angular
        .module('app.paeb.suivi_bcaf.convention_suivi_bcaf', [])
        .config(config);
    var vs ;
    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_suivi_bcaf_convention_suivi_bcaf', {
            url      : '/donnees-de-base/convention_suivi_bcaf',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/suivi_bcaf/convention_suivi_bcaf/convention_suivi_bcaf.html',
                    controller : 'Convention_suivi_bcafController as vm'
                }
            },
            bodyClass: 'convention_suivi_bcaf',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "convention_suivi_bcaf"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.suivi_bcaf.convention_suivi_bcaf', {
            title: 'Suivi convention (BCAF)',
            icon  : 'icon-rotate-3d',
            state: 'app.paeb_suivi_bcaf_convention_suivi_bcaf',
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
