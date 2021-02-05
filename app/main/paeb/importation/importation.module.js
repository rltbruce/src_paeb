(function ()
{
    'use strict';

    angular
        .module('app.paeb.importation', [])
        .run(testPermission)
        .config(config);
var vs;
    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_importation', {
            url      : '/donnees-de-base/importation',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/importation/importation.html',
                    controller : 'ImportationController as vm'
                }
            },
            bodyClass: 'importation',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "importation"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.importation', {
            title: 'Importation',
            icon  : 'icon-nfc-variant',
            state: 'app.paeb_importation',
			weight: 8,
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
                var permissions = ["AAC","DPFI","ADMIN"];
                var x =  loginService.gestionMenu(permissions,permission);        
                vs = x ;

            });
        }
     
    }

})();
