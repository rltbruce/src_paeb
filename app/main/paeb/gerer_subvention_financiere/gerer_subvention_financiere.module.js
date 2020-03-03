(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_subvention_financiere', [			
           // 'app.paeb.gerer_subvention_financiere.validation_demande_deblocage_feffi',
            //'app.paeb.gerer_subvention_financiere.demande_deblocage_feffi',
            'app.paeb.gerer_subvention_financiere.suivi_daaf_ufp',
            //'app.paeb.gerer_subvention_financiere.validation_technique_deblocage_feffi',
            //'app.paeb.gerer_subvention_financiere.validation_financiere_deblocage_feffi',
            //'app.paeb.gerer_subvention_financiere.transfert_daaf',
            'app.paeb.gerer_subvention_financiere.niveau_ufp_daaf',
            'app.paeb.gerer_subvention_financiere.niveau_daaf_feffi',
            ])       
        .config(config);
        var vs ;

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        msNavigationServiceProvider.saveItem('paeb.gerer_subvention_financiere', {
            title : 'Gérer subvention financiere',
            icon  : 'icon-data',
            weight: 3
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
                var permissions = ["DDB"];
                var x =  loginService.gestionMenu(permissions,permission);        
                vs = x ;

            });
        }
     
    }

})();
