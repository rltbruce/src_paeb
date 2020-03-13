(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_pr.prestation_pr', [
            'app.paeb.gerer_situation_pr.prestation_pr.module_odc',
            'app.paeb.gerer_situation_pr.prestation_pr.module_dpp',
            'app.paeb.gerer_situation_pr.prestation_pr.module_emies',
            'app.paeb.gerer_situation_pr.prestation_pr.module_gfpc',
            'app.paeb.gerer_situation_pr.prestation_pr.module_pmc',
            'app.paeb.gerer_situation_pr.prestation_pr.module_sep'
            ])       
        .config(config);
        var vs ;

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        msNavigationServiceProvider.saveItem('paeb.gerer_situation_pr.prestation_pr', {
            title : 'Prestation',
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
