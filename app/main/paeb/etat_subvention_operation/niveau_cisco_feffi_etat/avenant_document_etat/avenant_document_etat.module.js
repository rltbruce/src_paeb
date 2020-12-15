(function ()
{
    'use strict';

    angular
        .module('app.paeb.etat_subvention_operation.niveau_cisco_feffi_etat.avenant_document_etat', [])
        .config(config);
var vs;
    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_etat_subvention_operation_niveau_cisco_feffi_etat_avenant_document_etat', {
            url      : '/donnees-de-base/etat_subvention_operation/niveau_cisco_feffi_etat/avenant_document_etat',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/etat_subvention_operation/niveau_cisco_feffi_etat/avenant_document_etat/avenant_document_etat.html',
                    controller : 'Avenant_document_etatController as vm'
                }
            },
            bodyClass: 'avenant_document_etat',
            data : {
              authorizer : true,
              permitted : ["ACC","ADMIN"],
              page: "avenant_document_etat"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.etat_subvention_operation.niveau_cisco_feffi_etat.avenant_document_etat', {
            title: 'Avenant et document FEFFI',
            icon  : 'icon-blur-radial',
            state: 'app.paeb_etat_subvention_operation_niveau_cisco_feffi_etat_avenant_document_etat',
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
                var permissions = ["BCAF","ADMIN"];
                var x =  loginService.gestionMenu(permissions,permission);        
                vs = x ;

            });
        }
     
    }

})();
