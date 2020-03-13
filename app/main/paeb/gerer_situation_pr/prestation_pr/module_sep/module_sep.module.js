(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_pr.prestation_pr.module_sep', [
            'app.paeb.gerer_situation_pr.prestation_pr.module_sep.module_sep_insertion',
            'app.paeb.gerer_situation_pr.prestation_pr.module_sep.module_sep_valide'
            ])       
        .config(config);
        var vs ;

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        msNavigationServiceProvider.saveItem('paeb.gerer_situation_pr.prestation_pr.module_sep', {
            title : 'Module sep',
            icon  : 'icon-data',
            weight: 1
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
