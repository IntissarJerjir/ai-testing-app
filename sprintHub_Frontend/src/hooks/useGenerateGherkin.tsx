import { useMutation } from '@tanstack/react-query';
import { taskService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

export function useGenerateGherkin() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: (projectTaskId: string) => taskService.generateGherkinTestCase(projectTaskId),
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to generate test case.',
      });
    },
  });
}
