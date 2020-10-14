(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_subvention_financiere', [			
           // 'app.paeb.gerer_subvention_financiere.validation_demande_deblocage_feffi',
            //'app.paeb.gerer_subvention_financiere.demande_deblocage_feffi',
            //'app.paeb.gerer_subvention_financiere.suivi_daaf_ufp',
            //'app.paeb.gerer_subvention_financiere.validation_technique_deblocage_feffi',
            //'app.paeb.gerer_subvention_financiere.validation_financiere_deblocage_feffi',
            //'app.paeb.gerer_subvention_financiere.transfert_daaf',
            'app.paeb.gerer_subvention_financiere.niveau_ufp_daaf',
            'app.paeb.gerer_subvention_financiere.niveau_daaf_feffi',
            'app.paeb.gerer_subvention_financiere.niveau_ufp_feffi',
            'app.paeb.gerer_subvention_financiere.niveau_feffi_prestataire',
            'app.paeb.gerer_subvention_financiere.niveau_feffi_feffi'
            ])
        .run(testPermission)        
        .config(config);
        var vs ;

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        msNavigationServiceProvider.saveItem('paeb.gerer_subvention_financiere', {
            title : 'Gestion financière des activités',
            icon  : 'icon-credit-card-multiple',
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
                var permissions = ["UFP","OBCAF","BCAF","DAAF","DPFI","ADMIN"];
                var x =  loginService.gestionMenu(permissions,permission);        
                vs = x ;

            });
        }
     
    }

})();
