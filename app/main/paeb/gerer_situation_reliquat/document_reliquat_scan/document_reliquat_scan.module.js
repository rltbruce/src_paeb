(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_reliquat.document_reliquat_scan', [])
        .run(testPermission)
        .config(config);
        var vs ;

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_gerer_situation_reliquat_document_reliquat_scan', {
            url      : '/donnees-de-base/document_reliquat_scan',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/gerer_situation_reliquat/document_reliquat_scan/document_reliquat_scan.html',
                    controller : 'Document_reliquat_scanController as vm'
                }
            },
            bodyClass: 'document_reliquat_scan',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "document_reliquat_scan"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.gerer_situation_reliquat.document_reliquat_scan', {
            title: 'Scan document',
            icon  : 'icon-blur-radial',
            state: 'app.paeb_gerer_situation_reliquat_document_reliquat_scan',
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