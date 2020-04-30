(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_entreprise.document_prestataire_scan', [])
        .run(testPermission)
        .config(config);
        var vs ;

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_gerer_situation_entreprise_document_prestataire_scan', {
            url      : '/donnees-de-base/document_prestataire_scan',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/gerer_situation_entreprise/document_prestataire_scan/document_prestataire_scan.html',
                    controller : 'Document_prestataire_scanController as vm'
                }
            },
            bodyClass: 'document_prestataire_scan',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "document_prestataire_scan"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.gerer_situation_entreprise.document_prestataire_scan', {
            title: 'Scan document',
            icon  : 'icon-blur-radial',
            state: 'app.paeb_gerer_situation_entreprise_document_prestataire_scan',
			weight: 9,
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
